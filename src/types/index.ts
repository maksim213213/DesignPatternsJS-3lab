export enum AccessLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  ADMIN = 3,
}

export enum OperationType {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  LIST = 'LIST',
}

export interface AccessLogEntry {
  readonly timestamp: string;
  readonly operation: OperationType;
  readonly filePath: string;
  readonly userLevel: AccessLevel;
  readonly requiredLevel: AccessLevel;
  readonly allowed: boolean;
}

export interface IFileStorage {
  readFile(filePath: string): string;
  writeFile(filePath: string, content: string): void;
  deleteFile(filePath: string): void;
  listFiles(): string[];
}

export interface IAccessControl {
  checkAccess(requiredLevel: AccessLevel, operation: OperationType, filePath: string): boolean;
  getAccessLog(): AccessLogEntry[];
}

export interface ICommand {
  execute(): unknown;
  undo(): void;
  getDescription(): string;
}

export interface ICommandHistory {
  execute(command: ICommand): void;
  undo(): void;
  undoAll(): void;
  getHistory(): string[];
}
