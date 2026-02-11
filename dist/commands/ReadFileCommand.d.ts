import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';
export declare class ReadFileCommand extends BaseCommand {
    private readonly filePath;
    private result;
    constructor(storage: IFileStorage, filePath: string);
    execute(): string;
    undo(): void;
    getDescription(): string;
}
//# sourceMappingURL=ReadFileCommand.d.ts.map