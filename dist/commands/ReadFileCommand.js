"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadFileCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
class ReadFileCommand extends BaseCommand_1.BaseCommand {
    constructor(storage, filePath) {
        super(storage);
        this.filePath = filePath;
        this.result = null;
    }
    execute() {
        this.result = this.storage.readFile(this.filePath);
        return this.result;
    }
    undo() {
        this.result = null;
    }
    getDescription() {
        return `Read file: ${this.filePath}`;
    }
}
exports.ReadFileCommand = ReadFileCommand;
//# sourceMappingURL=ReadFileCommand.js.map