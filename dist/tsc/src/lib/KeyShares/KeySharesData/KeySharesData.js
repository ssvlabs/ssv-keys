"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesData = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const validators_1 = require("./validators");
const operator_helper_1 = require("../../helpers/operator.helper");
class KeySharesData {
    constructor() {
        this.ownerNonce = null;
        this.ownerAddress = null;
        this.publicKey = null;
        this.operators = null;
    }
    update(data) {
        if (data.ownerAddress) {
            this.ownerAddress = data.ownerAddress;
        }
        if (typeof data.ownerNonce === 'number') {
            this.ownerNonce = data.ownerNonce;
        }
        if (data.publicKey) {
            this.publicKey = data.publicKey;
        }
        if (data.operators) {
            this.operators = (0, operator_helper_1.operatorSortedList)(data.operators);
        }
    }
    /**
     * Do all possible validations.
     */
    async validate() {
        (0, class_validator_1.validateSync)(this);
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
        return this.operators.map(operator => String(operator.operatorKey));
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, validators_1.OwnerNonceValidator)()
], KeySharesData.prototype, "ownerNonce", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, validators_1.OwnerAddressValidator)()
], KeySharesData.prototype, "ownerAddress", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(98, 98),
    (0, validators_1.PublicKeyValidator)()
], KeySharesData.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, validators_1.OpeatorsListValidator)()
], KeySharesData.prototype, "operators", void 0);
exports.KeySharesData = KeySharesData;
//# sourceMappingURL=KeySharesData.js.map