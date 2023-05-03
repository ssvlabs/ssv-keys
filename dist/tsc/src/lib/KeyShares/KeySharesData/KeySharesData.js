"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesData = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const OperatorData_1 = require("./OperatorData");
const operator_unique_1 = require("./validators/operator-unique");
const public_key_1 = require("./validators/public-key");
class KeySharesData {
    constructor() {
        this.publicKey = null;
        this.operators = null;
    }
    update(data) {
        if (data.publicKey) {
            this.publicKey = data.publicKey;
        }
        if (data.operators) {
            this.operators = data.operators
                .sort((a, b) => +a.id - +b.id)
                .map((operator) => {
                if (!operator.id || !operator.publicKey) {
                    throw Error('Mismatch amount of operator ids and operator keys.');
                }
                return new OperatorData_1.OperatorData(operator);
            });
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
        return this.operators.map(operator => String(operator.publicKey));
    }
}
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
exports.KeySharesData = KeySharesData;
//# sourceMappingURL=KeySharesData.js.map