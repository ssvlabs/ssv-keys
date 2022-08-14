"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesDataV2 = exports.OperatorV2 = exports.KeySharesKeysV2 = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const js_base64_1 = require("js-base64");
const class_validator_1 = require("class-validator");
const BLS_1 = tslib_1.__importDefault(require("../../BLS"));
const operator_1 = require("../../../commands/actions/validators/operator");
const web3 = new web3_1.default();
// ---------------------------------------------------------------
// Structure classes
// ---------------------------------------------------------------
class KeySharesKeysV2 {
    constructor(publicKeys, encryptedKeys) {
        this.publicKeys = publicKeys;
        this.encryptedKeys = encryptedKeys;
    }
    /**
     * Build encrypted shares that can be used for encryption flow.
     * @param operatorPublicKeys
     */
    toEncryptedShares(operatorPublicKeys) {
        if (this.publicKeys.length !== this.encryptedKeys.length
            || this.publicKeys.length !== operatorPublicKeys.length
            || this.encryptedKeys.length !== operatorPublicKeys.length) {
            throw Error('Operator public keys and shares public/encrypted keys length does not match.');
        }
        const encryptedShares = [];
        for (let i = 0; i < operatorPublicKeys.length; i += 1) {
            const operatorPublicKey = operatorPublicKeys[i];
            const privateKey = this.encryptedKeys[i];
            const publicKey = this.publicKeys[i];
            encryptedShares.push({
                operatorPublicKey,
                privateKey,
                publicKey,
            });
        }
        return encryptedShares;
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
class OperatorV2 {
    constructor(id, publicKey) {
        this.id = id;
        this.publicKey = publicKey;
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsInt)()
], OperatorV2.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(98)
], OperatorV2.prototype, "publicKey", void 0);
exports.OperatorV2 = OperatorV2;
class KeySharesDataV2 {
    constructor(data) {
        this.publicKey = data.publicKey;
        this.operators = data.operators.map((operator) => new OperatorV2(operator.id, operator.publicKey));
        this.shares = new KeySharesKeysV2(data.shares.publicKeys, data.shares.encryptedKeys);
    }
    /**
     * Get the list of shares public keys.
     */
    get sharesPublicKeys() {
        var _a;
        return ((_a = this.shares) === null || _a === void 0 ? void 0 : _a.publicKeys) || null;
    }
    /**
     * Get the list of encrypted shares.
     */
    get sharesEncryptedKeys() {
        var _a;
        return ((_a = this.shares) === null || _a === void 0 ? void 0 : _a.encryptedKeys) || null;
    }
    /**
     * Get the list of operators IDs.
     */
    get operatorIds() {
        return this.operators.map(operator => operator.id);
    }
    /**
     * Get the list of operators public keys.
     */
    get operatorPublicKeys() {
        return this.operators.map(operator => operator.publicKey);
    }
    /**
     * Try to BLS deserialize validator public key.
     */
    validateValidatorPublicKey() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                BLS_1.default.deserializeHexStrToPublicKey(this.publicKey.replace('0x', ''));
            }
            catch (e) {
                throw Error(`Can not BLS deserialize validator public key: ${this.publicKey}. Error: ${String(e)}`);
            }
        });
    }
    /**
     * Try to BLS deserialize shares public keys.
     */
    validateSharesPublicKeys() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.sharesPublicKeys) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            let publicKeyWithError = '';
            try {
                for (const publicKey of this.sharesPublicKeys) {
                    publicKeyWithError = publicKey;
                    BLS_1.default.deserializeHexStrToPublicKey(publicKey.replace('0x', ''));
                }
            }
            catch (e) {
                throw Error(`Can not BLS deserialize shares public key: ${publicKeyWithError}. Error: ${String(e)}`);
            }
        });
    }
    /**
     * If shares encrypted keys are ABI encoded - try to decode them.
     */
    validateSharesEncryptedKeys() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.sharesEncryptedKeys) === null || _a === void 0 ? void 0 : _a.length)) {
                return;
            }
            let encryptedKeyWithError = '';
            try {
                this.sharesEncryptedKeys.map(encryptedKey => {
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
        });
    }
    /**
     * Check that counts are consistent.
     */
    validateCounts() {
        var _a, _b;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!((_a = this.sharesEncryptedKeys) === null || _a === void 0 ? void 0 : _a.length) || !((_b = this.sharesPublicKeys) === null || _b === void 0 ? void 0 : _b.length)) {
                return;
            }
            if (this.operatorIds.length !== this.sharesEncryptedKeys.length
                || this.operatorIds.length !== this.sharesPublicKeys.length
                || this.operatorIds.length !== this.operatorPublicKeys.length) {
                throw Error('Length of operators and shares should be equal.');
            }
        });
    }
    /**
     * Go over operator public keys and try to check if they are:
     * 1) valid base 64 strings
     * 2) when base 64 decoded - valid RSA public key
     */
    validateOperatorsPublicKeys() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (const operatorPublicKey of this.operatorPublicKeys) {
                const result = yield (0, operator_1.operatorValidator)(operatorPublicKey);
                if (result !== true) {
                    throw Error(String(result));
                }
            }
        });
    }
    /**
     * Do all possible validations.
     */
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield BLS_1.default.init(BLS_1.default.BLS12_381);
            yield this.validateCounts();
            yield this.validateSharesPublicKeys();
            yield this.validateValidatorPublicKey();
            yield this.validateSharesEncryptedKeys();
            yield this.validateOperatorsPublicKeys();
        });
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(98, 98)
], KeySharesDataV2.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)()
], KeySharesDataV2.prototype, "operators", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeySharesDataV2.prototype, "shares", void 0);
exports.KeySharesDataV2 = KeySharesDataV2;
//# sourceMappingURL=KeySharesDataV2.js.map