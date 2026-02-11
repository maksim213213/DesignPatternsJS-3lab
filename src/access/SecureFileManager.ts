import {
  IFileStorage,
  IAccessControl,
  AccessLevel,
  OperationType,
  AccessLogEntry,
} from '../types';

export class SecureFileManager implements IFileStorage, IAccessControl {
  private readonly accessLog: AccessLogEntry[] = [];

  constructor(
    private readonly storage: IFileStorage,
    private readonly userAccessLevel: AccessLevel,
  ) {}

  readFile(filePath: string): string {
    this.checkAccess(AccessLevel.READ, OperationType.READ, filePath);
    return this.storage.readFile(filePath);
  }

  writeFile(filePath: string, content: string): void {
    this.checkAccess(AccessLevel.WRITE, OperationType.WRITE, filePath);
    this.storage.writeFile(filePath, content);
  }

  deleteFile(filePath: string): void {
    this.checkAccess(AccessLevel.ADMIN, OperationType.DELETE, filePath);
    this.storage.deleteFile(filePath);
  }

  listFiles(): string[] {
    this.checkAccess(AccessLevel.READ, OperationType.LIST, '*');
    return this.storage.listFiles();
  }

  checkAccess(
    requiredLevel: AccessLevel,
    operation: OperationType,
    filePath: string,
  ): boolean {
    const allowed = this.userAccessLevel >= requiredLevel;
    this.logAccess(operation, filePath, requiredLevel, allowed);

    if (!allowed) {
      const message = `Access denied: "${operation}" on "${filePath}" (required level ${requiredLevel}, you have ${this.userAccessLevel})`;
      console.log(message);
      throw new Error(message);
    }

    return true;
  }

  getAccessLog(): AccessLogEntry[] {
    return [...this.accessLog];
  }

  printAccessLog(): void {
    console.log('Access Log:');
    this.accessLog.forEach((entry) => {
      const status = entry.allowed ? 'ALLOW' : 'DENY';
      console.log(
        `${status} ${entry.timestamp} ${entry.operation} "${entry.filePath}" (${entry.userLevel}/${entry.requiredLevel})`,
      );
    });
  }

  private logAccess(
    operation: OperationType,
    filePath: string,
    requiredLevel: AccessLevel,
    allowed: boolean,
  ): void {
    this.accessLog.push({
      timestamp: new Date().toISOString(),
      operation,
      filePath,
      userLevel: this.userAccessLevel,
      requiredLevel,
      allowed,
    });
  }
}
