"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorDataV3 = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const operator_1 = require("../../../commands/actions/validators/operator");
class OperatorDataV3 {
    setData(data) {
        if (data.id) {
            this.id = data.id;
        }
        if (data.publicKey) {
            this.publicKey = data.publicKey;
        }
    }
    /**
     * Validate operator ID and public key
     */
    validate() {
        if (!Number.isInteger(this.id)) {
            throw Error('Operator ID should be integer');
        }
        const result = (0, operator_1.operatorValidator)(this.publicKey || '');
        if (result !== true) {
            throw Error(String(result));
        }
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsInt)()
], OperatorDataV3.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(98)
], OperatorDataV3.prototype, "publicKey", void 0);
exports.OperatorDataV3 = OperatorDataV3;
//# sourceMappingURL=OperatorDataV3.js.map