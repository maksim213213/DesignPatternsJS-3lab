"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFileCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
class DeleteFileCommand extends BaseCommand_1.BaseCommand {
    constructor(storage, filePath) {
        super(storage);
        this.filePath = filePath;
        this.deletedContent = null;
    }
    execute() {
        this.deletedContent = this.storage.readFile(this.filePath);
        this.storage.deleteFile(this.filePath);
    }
    undo() {
        if (this.deletedContent !== null) {
            this.storage.writeFile(this.filePath, this.deletedContent);
        }
    }
    getDescription() {
        return `Delete file: ${this.filePath}`;
    }
}
exports.DeleteFileCommand = DeleteFileCommand;
//# sourceMappingURL=DeleteFileCommand.js.map