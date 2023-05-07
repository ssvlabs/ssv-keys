"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAbiDecodeError = void 0;
class KeySharesAbiDecodeError extends Error {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.KeySharesAbiDecodeError = KeySharesAbiDecodeError;
//# sourceMappingURL=keyshares.js.map