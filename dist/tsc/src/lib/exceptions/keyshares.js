"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAbiDecodeError = void 0;
const base_1 = require("./base");
class KeySharesAbiDecodeError extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.KeySharesAbiDecodeError = KeySharesAbiDecodeError;
//# sourceMappingURL=keyshares.js.map