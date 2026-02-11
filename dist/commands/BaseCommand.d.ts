import { ICommand, IFileStorage } from '../types';
export declare abstract class BaseCommand implements ICommand {
    protected readonly storage: IFileStorage;
    constructor(storage: IFileStorage);
    abstract execute(): unknown;
    abstract undo(): void;
    abstract getDescription(): string;
}
//# sourceMappingURL=BaseCommand.d.ts.map