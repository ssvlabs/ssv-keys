"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const JSEncrypt_1 = tslib_1.__importDefault(require("../JSEncrypt"));
const validators_1 = require("../../commands/actions/validators");
const operator_1 = require("../exceptions/operator");
class Encryption {
    constructor(operatorPublicKeys, shares) {
        this.operatorPublicKeys = [...operatorPublicKeys];
        this.shares = shares;
    }
    encrypt() {
        const encryptedShares = [];
        for (const [idx, operatorPublicKey] of this.operatorPublicKeys.entries()) {
            (0, validators_1.operatorPublicKeyValidator)(operatorPublicKey);
            const jsEncrypt = new JSEncrypt_1.default({});
            jsEncrypt.setPublicKey(operatorPublicKey);
            const encryptedPrivateKey = jsEncrypt.encrypt(this.shares[idx].privateKey);
            if (!encryptedPrivateKey) {
                throw new operator_1.OperatorPublicKeyError({
                    rsa: operatorPublicKey,
                    base64: encryptedPrivateKey,
                }, 'Private key encryption failed.');
            }
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