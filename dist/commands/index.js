"use strict";
/**
 * Экспорт всех команд
 * DRY: централизованная точка экспорта
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHistory = exports.ListFilesCommand = exports.DeleteFileCommand = exports.WriteFileCommand = exports.ReadFileCommand = exports.BaseCommand = void 0;
var BaseCommand_1 = require("./BaseCommand");
Object.defineProperty(exports, "BaseCommand", { enumerable: true, get: function () { return BaseCommand_1.BaseCommand; } });
var ReadFileCommand_1 = require("./ReadFileCommand");
Object.defineProperty(exports, "ReadFileCommand", { enumerable: true, get: function () { return ReadFileCommand_1.ReadFileCommand; } });
var WriteFileCommand_1 = require("./WriteFileCommand");
Object.defineProperty(exports, "WriteFileCommand", { enumerable: true, get: function () { return WriteFileCommand_1.WriteFileCommand; } });
var DeleteFileCommand_1 = require("./DeleteFileCommand");
Object.defineProperty(exports, "DeleteFileCommand", { enumerable: true, get: function () { return DeleteFileCommand_1.DeleteFileCommand; } });
var ListFilesCommand_1 = require("./ListFilesCommand");
Object.defineProperty(exports, "ListFilesCommand", { enumerable: true, get: function () { return ListFilesCommand_1.ListFilesCommand; } });
var CommandHistory_1 = require("./CommandHistory");
Object.defineProperty(exports, "CommandHistory", { enumerable: true, get: function () { return CommandHistory_1.CommandHistory; } });
//# sourceMappingURL=index.js.map