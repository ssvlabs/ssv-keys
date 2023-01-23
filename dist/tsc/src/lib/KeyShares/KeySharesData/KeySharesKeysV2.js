"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesKeysV2 = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const match_1 = require("./validators/match");
const public_key_1 = require("./validators/public-key");
const encrypted_key_1 = require("./validators/encrypted-key");
class KeySharesKeysV2 {
    /**
     * Set public and encrypted keys from data.
     * @param data
     */
    setData(data) {
        if (data.publicKeys) {
            this.publicKeys = data.publicKeys;
        }
        if (data.encryptedKeys) {
            this.encryptedKeys = data.encryptedKeys;
        }
    }
    /**
     * Validation of all data.
     */
    validate() {
        (0, class_validator_1.validateSync)(this);
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(98, {
        each: true,
    }),
    (0, public_key_1.PublicKeyValidator)({ each: true })
], KeySharesKeysV2.prototype, "publicKeys", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(98, {
        each: true,
    }),
    (0, match_1.MatchLengthValidator)('publicKeys', { message: 'Length of encrypted and public keys should be equal.' }),
    (0, encrypted_key_1.EncryptedKeyValidator)()
], KeySharesKeysV2.prototype, "encryptedKeys", void 0);
exports.KeySharesKeysV2 = KeySharesKeysV2;
//# sourceMappingURL=KeySharesKeysV2.js.map