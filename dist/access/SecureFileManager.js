"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecureFileManager = void 0;
const types_1 = require("../types");
class SecureFileManager {
    constructor(storage, userAccessLevel) {
        this.storage = storage;
        this.userAccessLevel = userAccessLevel;
        this.accessLog = [];
    }
    readFile(filePath) {
        this.checkAccess(types_1.AccessLevel.READ, types_1.OperationType.READ, filePath);
        return this.storage.readFile(filePath);
    }
    writeFile(filePath, content) {
        this.checkAccess(types_1.AccessLevel.WRITE, types_1.OperationType.WRITE, filePath);
        this.storage.writeFile(filePath, content);
    }
    deleteFile(filePath) {
        this.checkAccess(types_1.AccessLevel.ADMIN, types_1.OperationType.DELETE, filePath);
        this.storage.deleteFile(filePath);
    }
    listFiles() {
        this.checkAccess(types_1.AccessLevel.READ, types_1.OperationType.LIST, '*');
        return this.storage.listFiles();
    }
    checkAccess(requiredLevel, operation, filePath) {
        const allowed = this.userAccessLevel >= requiredLevel;
        this.logAccess(operation, filePath, requiredLevel, allowed);
        if (!allowed) {
            const message = `Access denied: "${operation}" on "${filePath}" (required level ${requiredLevel}, you have ${this.userAccessLevel})`;
            console.log(message);
            throw new Error(message);
        }
        return true;
    }
    getAccessLog() {
        return [...this.accessLog];
    }
    printAccessLog() {
        console.log('Access Log:');
        this.accessLog.forEach((entry) => {
            const status = entry.allowed ? 'ALLOW' : 'DENY';
            console.log(`${status} ${entry.timestamp} ${entry.operation} "${entry.filePath}" (${entry.userLevel}/${entry.requiredLevel})`);
        });
    }
    logAccess(operation, filePath, requiredLevel, allowed) {
        this.accessLog.push({
            timestamp: new Date().toISOString(),
            operation,
            filePath,
            userLevel: this.userAccessLevel,
            requiredLevel,
            allowed,
        });
    }
}
exports.SecureFileManager = SecureFileManager;
//# sourceMappingURL=SecureFileManager.js.map