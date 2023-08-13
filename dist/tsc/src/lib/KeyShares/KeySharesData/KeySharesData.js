"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesData = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const operator_unique_1 = require("./validators/operator-unique");
const public_key_1 = require("./validators/public-key");
const operator_helper_1 = require("../../helpers/operator.helper");
const owner_address_1 = require("./validators/owner-address");
const owner_nonce_1 = require("./validators/owner-nonce");
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
        if (data.ownerNonce) {
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
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            (0, class_validator_1.validateSync)(this);
        });
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
exports.KeySharesData = KeySharesData;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, owner_nonce_1.OwnerNonceValidator)()
], KeySharesData.prototype, "ownerNonce", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, owner_address_1.OwnerAddressValidator)()
], KeySharesData.prototype, "ownerAddress", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(98, 98),
    (0, public_key_1.PublicKeyValidator)()
], KeySharesData.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, operator_unique_1.OpeatorsListValidator)()
], KeySharesData.prototype, "operators", void 0);
//# sourceMappingURL=KeySharesData.js.map