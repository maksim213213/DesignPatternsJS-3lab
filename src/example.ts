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

function runExample(): void {
  console.log('File Access Management System');
  console.log('');

  const realStorage = new FileStorage();

  console.log('Scenario 1: Read-only User (Level 1)');
  const readOnlyUser = new SecureFileManager(realStorage, AccessLevel.READ);
  const historyReadOnly = new CommandHistory();

  realStorage.writeFile('config.txt', 'DATABASE_URL=localhost:5432');
  realStorage.writeFile('secret.key', 'sk-1234567890');

  try {
    historyReadOnly.execute(new ListFilesCommand(readOnlyUser));
    historyReadOnly.execute(new ReadFileCommand(readOnlyUser, 'config.txt'));
    historyReadOnly.execute(
      new WriteFileCommand(readOnlyUser, 'config.txt', 'new data'),
    );
  } catch {
    // ignore
  }

  readOnlyUser.printAccessLog();

  console.log('\nScenario 2: Write User (Level 2)');
  const writeUser = new SecureFileManager(realStorage, AccessLevel.WRITE);
  const historyWrite = new CommandHistory();

  try {
    historyWrite.execute(new ListFilesCommand(writeUser));
    historyWrite.execute(new ReadFileCommand(writeUser, 'config.txt'));
    historyWrite.execute(
      new WriteFileCommand(
        writeUser,
        'settings.json',
        '{"theme": "dark", "lang": "ru"}',
      ),
    );
    historyWrite.execute(new DeleteFileCommand(writeUser, 'config.txt'));
  } catch {
    // ignore
  }

  writeUser.printAccessLog();
  historyWrite.printHistory();

  console.log('\nScenario 3: Admin User (Level 3)');
  const adminUser = new SecureFileManager(realStorage, AccessLevel.ADMIN);
  const historyAdmin = new CommandHistory();

  try {
    historyAdmin.execute(new ListFilesCommand(adminUser));
    historyAdmin.execute(new ReadFileCommand(adminUser, 'secret.key'));
    historyAdmin.execute(
      new WriteFileCommand(
        adminUser,
        'users.db',
        '[{"id": 1, "name": "Alice"}]',
      ),
    );
    historyAdmin.execute(new DeleteFileCommand(adminUser, 'settings.json'));
    historyAdmin.execute(new ListFilesCommand(adminUser));
  } catch {
    // ignore
  }

  console.log('Final file list:', realStorage.listFiles());

  console.log('\nUndo demonstration');
  const testUser = new SecureFileManager(realStorage, AccessLevel.ADMIN);
  const history = new CommandHistory();

  console.log('Creating file');
  history.execute(
    new WriteFileCommand(testUser, 'test.txt', 'Original content'),
  );

  console.log('Modifying file');
  history.execute(
    new WriteFileCommand(testUser, 'test.txt', 'Modified content'),
  );

  console.log('Reading file');
  history.execute(new ReadFileCommand(testUser, 'test.txt'));

  console.log('Deleting file');
  history.execute(new DeleteFileCommand(testUser, 'test.txt'));

  console.log('Undoing 3 operations');
  history.undo();
  history.undo();
  history.undo();

  console.log('Checking file after undo');
  history.execute(new ReadFileCommand(testUser, 'test.txt'));
  history.printHistory();

  console.log('\nStatistics');
  const printStats = (user: SecureFileManager, name: string): void => {
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
