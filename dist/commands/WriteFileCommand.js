"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WriteFileCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
class WriteFileCommand extends BaseCommand_1.BaseCommand {
    constructor(storage, filePath, content) {
        super(storage);
        this.filePath = filePath;
        this.content = content;
        this.previousContent = null;
        this.fileExisted = false;
    }
    execute() {
        try {
            this.previousContent = this.storage.readFile(this.filePath);
            this.fileExisted = true;
        }
        catch {
            this.previousContent = null;
            this.fileExisted = false;
        }
        this.storage.writeFile(this.filePath, this.content);
    }
    undo() {
        if (!this.fileExisted) {
            try {
                this.storage.deleteFile(this.filePath);
            }
            catch {
                // ignore
            }
        }
        else if (this.previousContent !== null) {
            this.storage.writeFile(this.filePath, this.previousContent);
        }
    }
    getDescription() {
        return `Write file: ${this.filePath}`;
    }
}
exports.WriteFileCommand = WriteFileCommand;
//# sourceMappingURL=WriteFileCommand.js.map