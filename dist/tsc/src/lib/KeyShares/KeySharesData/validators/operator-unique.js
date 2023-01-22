"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpeatorsListValidator = exports.OpeatorsListValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const operator_1 = require("../exceptions/operator");
let OpeatorsListValidatorConstraint = class OpeatorsListValidatorConstraint {
    validate(operatorsList) {
        const operatorIds = new Set(), operatorPublicKeys = new Set();
        for (const operator of operatorsList || []) {
            if (operatorIds.has(operator.id)) {
                throw new operator_1.DuplicatedOperatorIdError(operator, `Operator ID already exists`);
            }
            operatorIds.add(operator.id);
            if (operatorPublicKeys.has(operator.publicKey)) {
                throw new operator_1.DuplicatedOperatorPublicKeyError(operator, `Operator public key already exists`);
            }
            operatorPublicKeys.add(operator.publicKey);
        }
        return true;
    }
    defaultMessage() {
        return 'The list of operators contains duplicate entries';
    }
};
OpeatorsListValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'uniqueList', async: false })
], OpeatorsListValidatorConstraint);
exports.OpeatorsListValidatorConstraint = OpeatorsListValidatorConstraint;
function OpeatorsListValidator(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: OpeatorsListValidatorConstraint,
        });
    };
}
exports.OpeatorsListValidator = OpeatorsListValidator;
//# sourceMappingURL=operator-unique.js.map