import { AccessLevel } from './types';
import { FileStorage } from './storage/FileStorage';
import { SecureFileManager } from './access/SecureFileManager';
import {
  ReadFileCommand,
  WriteFileCommand,
  DeleteFileCommand,
  ListFilesCommand,
  CommandHistory,
} from './commands';

class TestRunner {
  private passed = 0;
  private failed = 0;

  assert(condition: boolean, message: string): void {
    if (condition) {
      console.log(`PASS: ${message}`);
      this.passed++;
    } else {
      console.log(`FAIL: ${message}`);
      this.failed++;
    }
  }

  run(): void {
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

  private testBasicStorage(): void {
    console.log('Test: Basic File Storage');
    const storage = new FileStorage();
    storage.writeFile('test.txt', 'Content');
    const files = storage.listFiles();
    this.assert(files.includes('test.txt'), 'File created and listed');
    this.assert(storage.readFile('test.txt') === 'Content', 'Content preserved');

    storage.writeFile('test.txt', 'New');
    this.assert(storage.readFile('test.txt') === 'New', 'Content updated');

    storage.deleteFile('test.txt');
    this.assert(!storage.listFiles().includes('test.txt'), 'File deleted');
  }

  private testReadOnlyAccess(): void {
    console.log('\nTest: Read-Only Access Level');
    const storage = new FileStorage();
    storage.writeFile('data.txt', 'Secret');
    const user = new SecureFileManager(storage, AccessLevel.READ);

    try {
      user.readFile('data.txt');
      this.assert(true, 'READ allows file reading');
    } catch {
      this.assert(false, 'READ allows file reading');
    }

    try {
      user.writeFile('data.txt', 'Hacked');
      this.assert(false, 'READ denies file writing');
    } catch {
      this.assert(true, 'READ denies file writing');
    }

    try {
      user.deleteFile('data.txt');
      this.assert(false, 'READ denies file deletion');
    } catch {
      this.assert(true, 'READ denies file deletion');
    }
  }

  private testWriteAccess(): void {
    console.log('\nTest: Write Access Level');
    const storage = new FileStorage();
    const user = new SecureFileManager(storage, AccessLevel.WRITE);

    try {
      user.writeFile('file.txt', 'Data');
      this.assert(true, 'WRITE allows writing');
    } catch {
      this.assert(false, 'WRITE allows writing');
    }

    try {
      user.readFile('file.txt');
      this.assert(true, 'WRITE allows reading');
    } catch {
      this.assert(false, 'WRITE allows reading');
    }

    try {
      user.deleteFile('file.txt');
      this.assert(false, 'WRITE denies deletion');
    } catch {
      this.assert(true, 'WRITE denies deletion');
    }
  }

  private testAdminAccess(): void {
    console.log('\nTest: Admin Access Level');
    const storage = new FileStorage();
    const admin = new SecureFileManager(storage, AccessLevel.ADMIN);

    try {
      admin.writeFile('admin.txt', 'Admin data');
      admin.readFile('admin.txt');
      admin.deleteFile('admin.txt');
      this.assert(true, 'ADMIN allows all operations');
    } catch {
      this.assert(false, 'ADMIN allows all operations');
    }
  }

  private testCommands(): void {
    console.log('\nTest: Command Execution');
    const storage = new FileStorage();
    const user = new SecureFileManager(storage, AccessLevel.ADMIN);

    const writeCmd = new WriteFileCommand(user, 'cmd.txt', 'Test');
    writeCmd.execute();
    this.assert(
      storage.readFile('cmd.txt') === 'Test',
      'WriteFileCommand creates file',
    );

    const readCmd = new ReadFileCommand(user, 'cmd.txt');
    const result = readCmd.execute();
    this.assert(result === 'Test', 'ReadFileCommand reads file');

    const listCmd = new ListFilesCommand(user);
    const files = listCmd.execute() as string[];
    this.assert(files.includes('cmd.txt'), 'ListFilesCommand lists files');
  }

  private testCommandHistory(): void {
    console.log('\nTest: Command History and Undo');
    const storage = new FileStorage();
    const user = new SecureFileManager(storage, AccessLevel.ADMIN);
    const history = new CommandHistory();

    history.execute(new WriteFileCommand(user, 'undo.txt', 'Original'));
    this.assert(storage.readFile('undo.txt') === 'Original', 'File created');

    history.execute(new WriteFileCommand(user, 'undo.txt', 'Modified'));
    this.assert(storage.readFile('undo.txt') === 'Modified', 'File modified');

    history.undo();
    this.assert(
      storage.readFile('undo.txt') === 'Original',
      'Undo restores original content',
    );

    history.execute(new DeleteFileCommand(user, 'undo.txt'));
    this.assert(!storage.listFiles().includes('undo.txt'), 'File deleted');

    history.undo();
    this.assert(storage.listFiles().includes('undo.txt'), 'Undo restores file');
  }

  private testAccessLogging(): void {
    console.log('\nTest: Access Logging');
    const storage = new FileStorage();
    const user = new SecureFileManager(storage, AccessLevel.READ);

    user.readFile = () => {
      throw new Error('No file');
    };

    try {
      user.checkAccess(AccessLevel.WRITE, 'WRITE' as any, 'test.txt');
    } catch {
      // ignore
    }

    const log = user.getAccessLog();
    this.assert(log.length >= 1, 'Operations are logged');
    this.assert(
      log.some((e) => !e.allowed),
      'Denied operations are marked in log',
    );
  }

  private testErrorHandling(): void {
    console.log('\nTest: Error Handling');
    const storage = new FileStorage();
    const user = new SecureFileManager(storage, AccessLevel.ADMIN);

    let errorThrown = false;
    try {
      user.readFile('nonexistent.txt');
    } catch {
      errorThrown = true;
    }
    this.assert(errorThrown, 'Reading nonexistent file throws error');

    errorThrown = false;
    try {
      user.deleteFile('nonexistent.txt');
    } catch {
      errorThrown = true;
    }
    this.assert(errorThrown, 'Deleting nonexistent file throws error');
  }

  private testMultipleUsers(): void {
    console.log('\nTest: Multiple Users');
    const storage = new FileStorage();
    const admin = new SecureFileManager(storage, AccessLevel.ADMIN);
    const user = new SecureFileManager(storage, AccessLevel.READ);

    admin.writeFile('shared.txt', 'Shared');
    const content = user.readFile('shared.txt');
    this.assert(
      content === 'Shared',
      'Different users access same files',
    );

    let writeFailed = false;
    try {
      user.writeFile('shared.txt', 'Hacked');
    } catch {
      writeFailed = true;
    }
    this.assert(
      writeFailed,
      'Users with different permissions cannot change files',
    );
  }

  private printResults(): void {
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
