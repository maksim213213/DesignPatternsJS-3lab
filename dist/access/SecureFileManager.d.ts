import { IFileStorage, IAccessControl, AccessLevel, OperationType, AccessLogEntry } from '../types';
export declare class SecureFileManager implements IFileStorage, IAccessControl {
    private readonly storage;
    private readonly userAccessLevel;
    private readonly accessLog;
    constructor(storage: IFileStorage, userAccessLevel: AccessLevel);
    readFile(filePath: string): string;
    writeFile(filePath: string, content: string): void;
    deleteFile(filePath: string): void;
    listFiles(): string[];
    checkAccess(requiredLevel: AccessLevel, operation: OperationType, filePath: string): boolean;
    getAccessLog(): AccessLogEntry[];
    printAccessLog(): void;
    private logAccess;
}
//# sourceMappingURL=SecureFileManager.d.ts.map