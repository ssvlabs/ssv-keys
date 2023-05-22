"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleSharesSignatureInvalid = exports.BLSDeserializeError = void 0;
class BLSDeserializeError extends Error {
    constructor(publicKey, message) {
        super(message);
        this.publicKey = publicKey;
    }
}
exports.BLSDeserializeError = BLSDeserializeError;
class SingleSharesSignatureInvalid extends Error {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.SingleSharesSignatureInvalid = SingleSharesSignatureInvalid;
//# sourceMappingURL=bls.js.map