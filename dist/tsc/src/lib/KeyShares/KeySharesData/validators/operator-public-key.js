"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpeatorPublicKeyValidator = exports.OpeatorPublicKeyValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const operator_1 = require("../../../../commands/actions/validators/operator");
let OpeatorPublicKeyValidatorConstraint = class OpeatorPublicKeyValidatorConstraint {
    validate(value) {
        return (0, operator_1.operatorPublicKeyValidator)(value);
    }
    defaultMessage() {
        return 'Invalid operator public key';
    }
};
OpeatorPublicKeyValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'operatorKey', async: false })
], OpeatorPublicKeyValidatorConstraint);
exports.OpeatorPublicKeyValidatorConstraint = OpeatorPublicKeyValidatorConstraint;
function OpeatorPublicKeyValidator(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: OpeatorPublicKeyValidatorConstraint,
        });
    };
}
exports.OpeatorPublicKeyValidator = OpeatorPublicKeyValidator;
//# sourceMappingURL=operator-public-key.js.map