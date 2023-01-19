"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesDataV3 = void 0;
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const class_validator_1 = require("class-validator");
const BLS_1 = tslib_1.__importDefault(require("../../BLS"));
const OperatorDataV3_1 = require("./OperatorDataV3");
const KeySharesKeysV3_1 = require("./KeySharesKeysV3");
const operator_1 = require("./exceptions/operator");
const bls_1 = require("./exceptions/bls");
class KeySharesDataV3 {
    constructor() {
        this.publicKey = null;
        this.operators = null;
        this.shares = null;
    }
    setData(data) {
        if (data.publicKey) {
            this.publicKey = data.publicKey;
        }
        if (data.operators) {
            this.operators = data.operators.map((operator) => {
                const operatorData = new OperatorDataV3_1.OperatorDataV3();
                operatorData.setData(operator);
                return operatorData;
            });
        }
        if (data.shares) {
            const sharesInstance = new KeySharesKeysV3_1.KeySharesKeysV3();
            if (underscore_1.default.isArray(data.shares)) {
                sharesInstance.setData({
                    publicKeys: data.shares.map((share) => share.publicKey),
                    encryptedKeys: data.shares.map((share) => share.privateKey),
                });
            }
            else {
                sharesInstance.setData(data.shares);
            }
            this.shares = sharesInstance;
        }
    }
    /**
     * Do all possible validations.
     */
    validate() {
        var _a;
        this.validateDuplicates();
        BLS_1.default.init(BLS_1.default.BLS12_381);
        this.validateCounts();
        (_a = this.shares) === null || _a === void 0 ? void 0 : _a.validate();
        this.validatePublicKey();
        this.validateOperators();
    }
    /**
     * Get the list of shares public keys.
     */
    get sharesPublicKeys() {
        var _a;
        return ((_a = this.shares) === null || _a === void 0 ? void 0 : _a.publicKeys) || [];
    }
    /**
     * Get the list of encrypted shares.
     */
    get sharesEncryptedKeys() {
        var _a;
        return ((_a = this.shares) === null || _a === void 0 ? void 0 : _a.encryptedKeys) || [];
    }
    /**
     * Get the list of operators IDs.
     */
    get operatorIds() {
        var _a;
        if (!((_a = this.operators) === null || _a === void 0 ? void 0 : _a.length)) {
            return [];
        }
        return this.operators.map(operator => parseInt(String(operator.id), 10));
    }
    /**
     * Get the list of operators public keys.
     */
    get operatorPublicKeys() {
        var _a;
        if (!((_a = this.operators) === null || _a === void 0 ? void 0 : _a.length)) {
            return [];
        }
        return this.operators.map(operator => String(operator.publicKey));
    }
    /**
     * Try to BLS deserialize validator public key.
     */
    validatePublicKey() {
        if (!this.publicKey) {
            return;
        }
        try {
            BLS_1.default.deserializeHexStrToPublicKey(this.publicKey.replace('0x', ''));
        }
        catch (e) {
            throw new bls_1.BLSDeserializeError(this.publicKey, `Can not BLS deserialize validator public key`);
        }
    }
    /**
     * Check that counts are consistent.
     */
    validateCounts() {
        var _a, _b;
        if (!((_a = this.sharesEncryptedKeys) === null || _a === void 0 ? void 0 : _a.length) || !((_b = this.sharesPublicKeys) === null || _b === void 0 ? void 0 : _b.length)) {
            return;
        }
        if (this.operatorIds.length !== this.sharesEncryptedKeys.length
            || this.operatorIds.length !== this.sharesPublicKeys.length
            || this.operatorIds.length !== this.operatorPublicKeys.length) {
            throw new operator_1.OperatorsWithSharesCountsMismatchError(this.operators || [], this.shares, 'Length of operators and shares should be equal.');
        }
    }
    /**
     * Validate all operators
     */
    validateOperators() {
        for (const operator of this.operators || []) {
            operator.validate();
        }
    }
    /**
     * Do not allow to use duplicated operator IDs and public keys.
     */
    validateDuplicates() {
        const operatorIds = {}, operatorPublicKeys = {};
        for (const operator of this.operators || []) {
            if (operatorIds[String(operator.id)] === true) {
                throw new operator_1.DuplicatedOperatorIdError(operator, `Operator ID already exists`);
            }
            operatorIds[String(operator.id)] = true;
            if (operatorPublicKeys[String(operator.publicKey)] === true) {
                throw new operator_1.DuplicatedOperatorPublicKeyError(operator, `Operator public key already exists`);
            }
            operatorPublicKeys[String(operator.publicKey)] = true;
        }
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(98, 98)
], KeySharesDataV3.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true })
], KeySharesDataV3.prototype, "operators", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeySharesDataV3.prototype, "shares", void 0);
exports.KeySharesDataV3 = KeySharesDataV3;
//# sourceMappingURL=KeySharesDataV3.js.map