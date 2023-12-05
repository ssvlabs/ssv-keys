"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCustomError = void 0;
class BaseCustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.stack = `${this.name}: ${this.message}`; // Customizing stack
    }
}
exports.BaseCustomError = BaseCustomError;
//# sourceMappingURL=base.js.map