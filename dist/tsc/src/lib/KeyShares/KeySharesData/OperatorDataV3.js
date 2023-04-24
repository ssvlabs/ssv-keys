"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorDataV3 = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const operator_public_key_1 = require("./validators/operator-public-key");
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
        (0, class_validator_1.validateSync)(this);
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'The operator id is null' }),
    (0, class_validator_1.IsDefined)({ message: 'The operator id is undefined' }),
    (0, class_validator_1.IsInt)({ message: 'The operator id must be an integer' })
], OperatorDataV3.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'The operator public key is null' }),
    (0, class_validator_1.IsDefined)({ message: 'The operator public key is undefined' }),
    (0, class_validator_1.IsString)({ message: 'The operator public key must be a string' }),
    (0, operator_public_key_1.OpeatorPublicKeyValidator)()
], OperatorDataV3.prototype, "publicKey", void 0);
exports.OperatorDataV3 = OperatorDataV3;
//# sourceMappingURL=OperatorDataV3.js.map