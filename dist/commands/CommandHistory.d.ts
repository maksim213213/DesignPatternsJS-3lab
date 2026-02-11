import { ICommand, ICommandHistory } from '../types';
export declare class CommandHistory implements ICommandHistory {
    private readonly history;
    execute(command: ICommand): void;
    undo(): void;
    undoAll(): void;
    getHistory(): string[];
    printHistory(): void;
}
//# sourceMappingURL=CommandHistory.d.ts.map