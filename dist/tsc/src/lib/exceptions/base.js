"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeysException = void 0;
class SSVKeysException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.trace = this.stack;
        this.stack = `${this.name}: ${this.message}`; // Customizing stack
    }
}
exports.SSVKeysException = SSVKeysException;
//# sourceMappingURL=base.js.map