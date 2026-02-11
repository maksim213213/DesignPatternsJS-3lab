"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationType = exports.AccessLevel = void 0;
var AccessLevel;
(function (AccessLevel) {
    AccessLevel[AccessLevel["NONE"] = 0] = "NONE";
    AccessLevel[AccessLevel["READ"] = 1] = "READ";
    AccessLevel[AccessLevel["WRITE"] = 2] = "WRITE";
    AccessLevel[AccessLevel["ADMIN"] = 3] = "ADMIN";
})(AccessLevel || (exports.AccessLevel = AccessLevel = {}));
var OperationType;
(function (OperationType) {
    OperationType["READ"] = "READ";
    OperationType["WRITE"] = "WRITE";
    OperationType["DELETE"] = "DELETE";
    OperationType["LIST"] = "LIST";
})(OperationType || (exports.OperationType = OperationType = {}));
//# sourceMappingURL=index.js.map