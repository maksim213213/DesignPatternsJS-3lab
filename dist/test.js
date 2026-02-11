"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const FileStorage_1 = require("./storage/FileStorage");
const SecureFileManager_1 = require("./access/SecureFileManager");
const commands_1 = require("./commands");
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
    }
    assert(condition, message) {
        if (condition) {
            console.log(`PASS: ${message}`);
            this.passed++;
        }
        else {
            console.log(`FAIL: ${message}`);
            this.failed++;
        }
    }
    run() {
        console.log('Running tests...\n');
        this.testBasicStorage();
        this.testReadOnlyAccess();
        this.testWriteAccess();
        this.testAdminAccess();
        this.testCommands();
        this.testCommandHistory();
        this.testAccessLogging();
        this.testErrorHandling();
        this.testMultipleUsers();
        this.printResults();
    }
    testBasicStorage() {
        console.log('Test: Basic File Storage');
        const storage = new FileStorage_1.FileStorage();
        storage.writeFile('test.txt', 'Content');
        const files = storage.listFiles();
        this.assert(files.includes('test.txt'), 'File created and listed');
        this.assert(storage.readFile('test.txt') === 'Content', 'Content preserved');
        storage.writeFile('test.txt', 'New');
        this.assert(storage.readFile('test.txt') === 'New', 'Content updated');
        storage.deleteFile('test.txt');
        this.assert(!storage.listFiles().includes('test.txt'), 'File deleted');
    }
    testReadOnlyAccess() {
        console.log('\nTest: Read-Only Access Level');
        const storage = new FileStorage_1.FileStorage();
        storage.writeFile('data.txt', 'Secret');
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.READ);
        try {
            user.readFile('data.txt');
            this.assert(true, 'READ allows file reading');
        }
        catch {
            this.assert(false, 'READ allows file reading');
        }
        try {
            user.writeFile('data.txt', 'Hacked');
            this.assert(false, 'READ denies file writing');
        }
        catch {
            this.assert(true, 'READ denies file writing');
        }
        try {
            user.deleteFile('data.txt');
            this.assert(false, 'READ denies file deletion');
        }
        catch {
            this.assert(true, 'READ denies file deletion');
        }
    }
    testWriteAccess() {
        console.log('\nTest: Write Access Level');
        const storage = new FileStorage_1.FileStorage();
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.WRITE);
        try {
            user.writeFile('file.txt', 'Data');
            this.assert(true, 'WRITE allows writing');
        }
        catch {
            this.assert(false, 'WRITE allows writing');
        }
        try {
            user.readFile('file.txt');
            this.assert(true, 'WRITE allows reading');
        }
        catch {
            this.assert(false, 'WRITE allows reading');
        }
        try {
            user.deleteFile('file.txt');
            this.assert(false, 'WRITE denies deletion');
        }
        catch {
            this.assert(true, 'WRITE denies deletion');
        }
    }
    testAdminAccess() {
        console.log('\nTest: Admin Access Level');
        const storage = new FileStorage_1.FileStorage();
        const admin = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.ADMIN);
        try {
            admin.writeFile('admin.txt', 'Admin data');
            admin.readFile('admin.txt');
            admin.deleteFile('admin.txt');
            this.assert(true, 'ADMIN allows all operations');
        }
        catch {
            this.assert(false, 'ADMIN allows all operations');
        }
    }
    testCommands() {
        console.log('\nTest: Command Execution');
        const storage = new FileStorage_1.FileStorage();
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.ADMIN);
        const writeCmd = new commands_1.WriteFileCommand(user, 'cmd.txt', 'Test');
        writeCmd.execute();
        this.assert(storage.readFile('cmd.txt') === 'Test', 'WriteFileCommand creates file');
        const readCmd = new commands_1.ReadFileCommand(user, 'cmd.txt');
        const result = readCmd.execute();
        this.assert(result === 'Test', 'ReadFileCommand reads file');
        const listCmd = new commands_1.ListFilesCommand(user);
        const files = listCmd.execute();
        this.assert(files.includes('cmd.txt'), 'ListFilesCommand lists files');
    }
    testCommandHistory() {
        console.log('\nTest: Command History and Undo');
        const storage = new FileStorage_1.FileStorage();
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.ADMIN);
        const history = new commands_1.CommandHistory();
        history.execute(new commands_1.WriteFileCommand(user, 'undo.txt', 'Original'));
        this.assert(storage.readFile('undo.txt') === 'Original', 'File created');
        history.execute(new commands_1.WriteFileCommand(user, 'undo.txt', 'Modified'));
        this.assert(storage.readFile('undo.txt') === 'Modified', 'File modified');
        history.undo();
        this.assert(storage.readFile('undo.txt') === 'Original', 'Undo restores original content');
        history.execute(new commands_1.DeleteFileCommand(user, 'undo.txt'));
        this.assert(!storage.listFiles().includes('undo.txt'), 'File deleted');
        history.undo();
        this.assert(storage.listFiles().includes('undo.txt'), 'Undo restores file');
    }
    testAccessLogging() {
        console.log('\nTest: Access Logging');
        const storage = new FileStorage_1.FileStorage();
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.READ);
        user.readFile = () => {
            throw new Error('No file');
        };
        try {
            user.checkAccess(types_1.AccessLevel.WRITE, 'WRITE', 'test.txt');
        }
        catch {
            // ignore
        }
        const log = user.getAccessLog();
        this.assert(log.length >= 1, 'Operations are logged');
        this.assert(log.some((e) => !e.allowed), 'Denied operations are marked in log');
    }
    testErrorHandling() {
        console.log('\nTest: Error Handling');
        const storage = new FileStorage_1.FileStorage();
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.ADMIN);
        let errorThrown = false;
        try {
            user.readFile('nonexistent.txt');
        }
        catch {
            errorThrown = true;
        }
        this.assert(errorThrown, 'Reading nonexistent file throws error');
        errorThrown = false;
        try {
            user.deleteFile('nonexistent.txt');
        }
        catch {
            errorThrown = true;
        }
        this.assert(errorThrown, 'Deleting nonexistent file throws error');
    }
    testMultipleUsers() {
        console.log('\nTest: Multiple Users');
        const storage = new FileStorage_1.FileStorage();
        const admin = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.ADMIN);
        const user = new SecureFileManager_1.SecureFileManager(storage, types_1.AccessLevel.READ);
        admin.writeFile('shared.txt', 'Shared');
        const content = user.readFile('shared.txt');
        this.assert(content === 'Shared', 'Different users access same files');
        let writeFailed = false;
        try {
            user.writeFile('shared.txt', 'Hacked');
        }
        catch {
            writeFailed = true;
        }
        this.assert(writeFailed, 'Users with different permissions cannot change files');
    }
    printResults() {
        console.log('\n' + '='.repeat(40));
        console.log(`Tests passed: ${this.passed}`);
        console.log(`Tests failed: ${this.failed}`);
        const total = this.passed + this.failed;
        const percentage = ((this.passed / total) * 100).toFixed(1);
        console.log(`Success rate: ${percentage}%`);
    }
}
const runner = new TestRunner();
runner.run();
//# sourceMappingURL=test.js.map