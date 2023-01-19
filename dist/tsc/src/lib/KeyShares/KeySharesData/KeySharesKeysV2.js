"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesKeysV2 = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const js_base64_1 = require("js-base64");
const class_validator_1 = require("class-validator");
const BLS_1 = tslib_1.__importDefault(require("../../BLS"));
const web3 = new web3_1.default();
class KeySharesKeysV2 {
    /**
     * Set public and encrypted keys from data.
     * @param data
     */
    setData(data) {
        if (data.publicKeys) {
            this.validateArrayOfStrings(data.publicKeys);
            this.publicKeys = data.publicKeys;
        }
        if (data.encryptedKeys) {
            this.validateArrayOfStrings(data.encryptedKeys);
            this.encryptedKeys = data.encryptedKeys;
        }
    }
    /**
     * Validation of all data.
     */
    validate() {
        this.validatePublicKeys();
        this.validateEncryptedKeys();
    }
    /**
     * If shares encrypted keys are ABI encoded - try to decode them.
     */
    validateEncryptedKeys() {
        let encryptedKeyWithError = '';
        try {
            (this.encryptedKeys || []).map(encryptedKey => {
                let key = encryptedKey;
                // If the key is ABI encoded - decode it.
                if (key.startsWith('0x')) {
                    encryptedKeyWithError = key;
                    key = web3.eth.abi.decodeParameter('string', encryptedKey);
                }
                // ABI decoded key then should be a valid base 64 string
                (0, js_base64_1.decode)(String(key));
            });
        }
        catch (e) {
            throw Error(`Can not ABI decode shares encrypted key: ${encryptedKeyWithError}. Error: ${String(e)}`);
        }
    }
    /**
     * Try to BLS deserialize shares public keys.
     */
    validatePublicKeys() {
        let publicKeyWithError = '';
        try {
            for (const publicKey of this.publicKeys || []) {
                publicKeyWithError = publicKey;
                BLS_1.default.deserializeHexStrToPublicKey(publicKey.replace('0x', ''));
            }
        }
        catch (e) {
            throw Error(`Can not BLS deserialize shares public key: ${publicKeyWithError}. Error: ${String(e)}`);
        }
    }
    /**
     * Validate that the data is the array of strings.
     * @param data
     */
    validateArrayOfStrings(data) {
        if (!underscore_1.default.isArray(data)) {
            throw Error('Keys should be an array of strings');
        }
        const isArrayOfStrings = data.every((key) => typeof key === 'string');
        if (!isArrayOfStrings) {
            throw Error('Keys should be an array of strings');
        }
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(98, {
        each: true,
    })
], KeySharesKeysV2.prototype, "publicKeys", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.MinLength)(98, {
        each: true,
    })
], KeySharesKeysV2.prototype, "encryptedKeys", void 0);
exports.KeySharesKeysV2 = KeySharesKeysV2;
//# sourceMappingURL=KeySharesKeysV2.js.map