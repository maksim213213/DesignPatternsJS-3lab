"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHistory = void 0;
class CommandHistory {
    constructor() {
        this.history = [];
    }
    execute(command) {
        command.execute();
        this.history.push(command);
    }
    undo() {
        if (this.history.length === 0) {
            return;
        }
        const lastCommand = this.history.pop();
        if (lastCommand) {
            lastCommand.undo();
        }
    }
    undoAll() {
        while (this.history.length > 0) {
            this.undo();
        }
    }
    getHistory() {
        return this.history.map((cmd) => cmd.getDescription());
    }
    printHistory() {
        console.log('Command History:');
        if (this.history.length === 0) {
            console.log('  (empty)');
            return;
        }
        this.history.forEach((command, index) => {
            console.log(`  ${index + 1}. ${command.getDescription()}`);
        });
    }
}
exports.CommandHistory = CommandHistory;
//# sourceMappingURL=CommandHistory.js.map