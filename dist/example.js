"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const FileStorage_1 = require("./storage/FileStorage");
const SecureFileManager_1 = require("./access/SecureFileManager");
const commands_1 = require("./commands");
function runExample() {
    console.log('File Access Management System');
    console.log('');
    const realStorage = new FileStorage_1.FileStorage();
    console.log('Scenario 1: Read-only User (Level 1)');
    const readOnlyUser = new SecureFileManager_1.SecureFileManager(realStorage, types_1.AccessLevel.READ);
    const historyReadOnly = new commands_1.CommandHistory();
    realStorage.writeFile('config.txt', 'DATABASE_URL=localhost:5432');
    realStorage.writeFile('secret.key', 'sk-1234567890');
    try {
        historyReadOnly.execute(new commands_1.ListFilesCommand(readOnlyUser));
        historyReadOnly.execute(new commands_1.ReadFileCommand(readOnlyUser, 'config.txt'));
        historyReadOnly.execute(new commands_1.WriteFileCommand(readOnlyUser, 'config.txt', 'new data'));
    }
    catch {
        // ignore
    }
    readOnlyUser.printAccessLog();
    console.log('\nScenario 2: Write User (Level 2)');
    const writeUser = new SecureFileManager_1.SecureFileManager(realStorage, types_1.AccessLevel.WRITE);
    const historyWrite = new commands_1.CommandHistory();
    try {
        historyWrite.execute(new commands_1.ListFilesCommand(writeUser));
        historyWrite.execute(new commands_1.ReadFileCommand(writeUser, 'config.txt'));
        historyWrite.execute(new commands_1.WriteFileCommand(writeUser, 'settings.json', '{"theme": "dark", "lang": "ru"}'));
        historyWrite.execute(new commands_1.DeleteFileCommand(writeUser, 'config.txt'));
    }
    catch {
        // ignore
    }
    writeUser.printAccessLog();
    historyWrite.printHistory();
    console.log('\nScenario 3: Admin User (Level 3)');
    const adminUser = new SecureFileManager_1.SecureFileManager(realStorage, types_1.AccessLevel.ADMIN);
    const historyAdmin = new commands_1.CommandHistory();
    try {
        historyAdmin.execute(new commands_1.ListFilesCommand(adminUser));
        historyAdmin.execute(new commands_1.ReadFileCommand(adminUser, 'secret.key'));
        historyAdmin.execute(new commands_1.WriteFileCommand(adminUser, 'users.db', '[{"id": 1, "name": "Alice"}]'));
        historyAdmin.execute(new commands_1.DeleteFileCommand(adminUser, 'settings.json'));
        historyAdmin.execute(new commands_1.ListFilesCommand(adminUser));
    }
    catch {
        // ignore
    }
    console.log('Final file list:', realStorage.listFiles());
    console.log('\nUndo demonstration');
    const testUser = new SecureFileManager_1.SecureFileManager(realStorage, types_1.AccessLevel.ADMIN);
    const history = new commands_1.CommandHistory();
    console.log('Creating file');
    history.execute(new commands_1.WriteFileCommand(testUser, 'test.txt', 'Original content'));
    console.log('Modifying file');
    history.execute(new commands_1.WriteFileCommand(testUser, 'test.txt', 'Modified content'));
    console.log('Reading file');
    history.execute(new commands_1.ReadFileCommand(testUser, 'test.txt'));
    console.log('Deleting file');
    history.execute(new commands_1.DeleteFileCommand(testUser, 'test.txt'));
    console.log('Undoing 3 operations');
    history.undo();
    history.undo();
    history.undo();
    console.log('Checking file after undo');
    history.execute(new commands_1.ReadFileCommand(testUser, 'test.txt'));
    history.printHistory();
    console.log('\nStatistics');
    const printStats = (user, name) => {
        const log = user.getAccessLog();
        const allowed = log.filter((e) => e.allowed).length;
        const denied = log.filter((e) => !e.allowed).length;
        console.log(`${name}: ${log.length} operations (allowed: ${allowed}, denied: ${denied})`);
    };
    printStats(readOnlyUser, 'Read-only user');
    printStats(writeUser, 'Write user');
    printStats(adminUser, 'Admin user');
    console.log('Example completed');
}
runExample();
//# sourceMappingURL=example.js.map