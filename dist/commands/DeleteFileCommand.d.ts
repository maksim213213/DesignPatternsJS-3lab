import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';
export declare class DeleteFileCommand extends BaseCommand {
    private readonly filePath;
    private deletedContent;
    constructor(storage: IFileStorage, filePath: string);
    execute(): void;
    undo(): void;
    getDescription(): string;
}
//# sourceMappingURL=DeleteFileCommand.d.ts.map