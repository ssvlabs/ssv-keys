"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsencrypt_1 = tslib_1.__importDefault(require("jsencrypt"));
const js_base64_1 = require("js-base64");
class Encryption {
    constructor(operators, shares) {
        this.RAW_OPERATOR_PUBLIC_KEY_SIGNATURE = RegExp(/------BEGIN RSA PUBLIC KEY-----/, 'gmi');
        this.operators = operators.map((publicKey) => {
            if (this.RAW_OPERATOR_PUBLIC_KEY_SIGNATURE.test(publicKey)) {
                return publicKey;
            }
            return (0, js_base64_1.decode)(publicKey);
        });
        this.shares = shares;
    }
    encrypt() {
        const encryptedShares = [];
        Object.keys(this.operators).forEach((operator) => {
            const encrypt = new jsencrypt_1.default({});
            encrypt.setPublicKey(this.operators[operator]);
            const encrypted = encrypt.encrypt(this.shares[operator].privateKey);
            const encryptedShare = {
                operatorPublicKey: this.operators[operator],
                privateKey: String(encrypted),
                publicKey: this.shares[operator].publicKey,
            };
            encryptedShares.push(encryptedShare);
            return encryptedShare;
        });
        return encryptedShares;
    }
}
exports.default = Encryption;
//# sourceMappingURL=Encryption.js.map