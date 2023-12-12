"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleSharesSignatureInvalid = exports.BLSDeserializeError = void 0;
const base_1 = require("./base");
class BLSDeserializeError extends base_1.SSVKeysException {
    constructor(publicKey, message) {
        super(message);
        this.publicKey = publicKey;
    }
}
exports.BLSDeserializeError = BLSDeserializeError;
class SingleSharesSignatureInvalid extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.SingleSharesSignatureInvalid = SingleSharesSignatureInvalid;
//# sourceMappingURL=bls.js.map