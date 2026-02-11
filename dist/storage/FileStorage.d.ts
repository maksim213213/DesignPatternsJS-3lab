import { IFileStorage } from '../types';
export declare class FileStorage implements IFileStorage {
    private readonly files;
    readFile(filePath: string): string;
    writeFile(filePath: string, content: string): void;
    deleteFile(filePath: string): void;
    listFiles(): string[];
}
//# sourceMappingURL=FileStorage.d.ts.map