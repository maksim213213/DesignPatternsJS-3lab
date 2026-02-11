"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorage = void 0;
class FileStorage {
    constructor() {
        this.files = new Map();
    }
    readFile(filePath) {
        const content = this.files.get(filePath);
        if (!content) {
            throw new Error(`File not found: "${filePath}"`);
        }
        return content;
    }
    writeFile(filePath, content) {
        this.files.set(filePath, content);
    }
    deleteFile(filePath) {
        if (!this.files.has(filePath)) {
            throw new Error(`File not found: "${filePath}"`);
        }
        this.files.delete(filePath);
    }
    listFiles() {
        return Array.from(this.files.keys());
    }
}
exports.FileStorage = FileStorage;
//# sourceMappingURL=FileStorage.js.map