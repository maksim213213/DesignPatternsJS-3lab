"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListFilesCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
class ListFilesCommand extends BaseCommand_1.BaseCommand {
    constructor(storage) {
        super(storage);
        this.result = [];
    }
    execute() {
        this.result = this.storage.listFiles();
        return this.result;
    }
    undo() {
        this.result = [];
    }
    getDescription() {
        return 'List files';
    }
}
exports.ListFilesCommand = ListFilesCommand;
//# sourceMappingURL=ListFilesCommand.js.map