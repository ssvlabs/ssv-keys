"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const JSEncrypt_1 = tslib_1.__importDefault(require("../JSEncrypt"));
const operator_1 = require("../../commands/actions/validators/operator");
class Encryption {
    constructor(operatorPublicKeys, shares) {
        this.operatorPublicKeys = [...operatorPublicKeys];
        this.shares = shares;
    }
    encrypt() {
        const encryptedShares = [];
        for (const [idx, operatorPublicKey] of this.operatorPublicKeys.entries()) {
            (0, operator_1.operatorPublicKeyValidator)(operatorPublicKey);
            const jsEncrypt = new JSEncrypt_1.default({});
            jsEncrypt.setPublicKey(operatorPublicKey);
            const encryptedPrivateKey = jsEncrypt.encrypt(this.shares[idx].privateKey);
            const encryptedShare = {
                operatorPublicKey,
                privateKey: encryptedPrivateKey,
                publicKey: this.shares[idx].publicKey,
            };
            encryptedShares.push(encryptedShare);
        }
        return encryptedShares;
    }
}
exports.default = Encryption;
//# sourceMappingURL=Encryption.js.map