"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesDataV2 = void 0;
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const class_validator_1 = require("class-validator");
const OperatorDataV2_1 = require("./OperatorDataV2");
const KeySharesKeysV2_1 = require("./KeySharesKeysV2");
const operator_unique_1 = require("./validators/operator-unique");
const public_key_1 = require("./validators/public-key");
const match_1 = require("./validators/match");
class KeySharesDataV2 {
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
            this.operators = data.operators
                .sort((a, b) => +a.id - +b.id)
                .map((operator) => {
                const operatorData = new OperatorDataV2_1.OperatorDataV2();
                operatorData.setData(operator);
                return operatorData;
            });
        }
        if (data.encryptedShares) {
            const sharesInstance = new KeySharesKeysV2_1.KeySharesKeysV2();
            if (underscore_1.default.isArray(data.encryptedShares)) {
                sharesInstance.setData({
                    publicKeys: data.encryptedShares.map((share) => share.publicKey),
                    encryptedKeys: data.encryptedShares.map((share) => share.privateKey),
                });
            }
            else {
                sharesInstance.setData(data.encryptedShares);
            }
            this.shares = sharesInstance;
        }
    }
    /**
     * Do all possible validations.
     */
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (0, class_validator_1.validateSync)(this);
        });
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
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(98, 98),
    (0, public_key_1.PublicKeyValidator)()
], KeySharesDataV2.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, operator_unique_1.OpeatorsListValidator)()
], KeySharesDataV2.prototype, "operators", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, match_1.MatchLengthValidator)('operators', { message: 'Length of operators and shares should be equal.' })
], KeySharesDataV2.prototype, "shares", void 0);
exports.KeySharesDataV2 = KeySharesDataV2;
//# sourceMappingURL=KeySharesDataV2.js.map