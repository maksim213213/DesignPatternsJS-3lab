import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';
export declare class ListFilesCommand extends BaseCommand {
    private result;
    constructor(storage: IFileStorage);
    execute(): string[];
    undo(): void;
    getDescription(): string;
}
//# sourceMappingURL=ListFilesCommand.d.ts.map