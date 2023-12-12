"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorData = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const validators_1 = require("./validators");
class OperatorData {
    constructor(data) {
        this.id = data.id;
        this.operatorKey = data.operatorKey;
        this.validate();
    }
    /**
     * Validate operator id and public key
     */
    validate() {
        (0, class_validator_1.validateSync)(this);
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'The operator id is null' }),
    (0, class_validator_1.IsDefined)({ message: 'The operator id is undefined' }),
    (0, class_validator_1.IsInt)({ message: 'The operator id must be an integer' })
], OperatorData.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'The operator public key is null' }),
    (0, class_validator_1.IsDefined)({ message: 'The operator public key is undefined' }),
    (0, class_validator_1.IsString)({ message: 'The operator public key must be a string' }),
    (0, validators_1.OpeatorPublicKeyValidator)()
], OperatorData.prototype, "operatorKey", void 0);
exports.OperatorData = OperatorData;
//# sourceMappingURL=OperatorData.js.map