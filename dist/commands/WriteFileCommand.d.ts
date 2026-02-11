import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';
export declare class WriteFileCommand extends BaseCommand {
    private readonly filePath;
    private readonly content;
    private previousContent;
    private fileExisted;
    constructor(storage: IFileStorage, filePath: string, content: string);
    execute(): void;
    undo(): void;
    getDescription(): string;
}
//# sourceMappingURL=WriteFileCommand.d.ts.map