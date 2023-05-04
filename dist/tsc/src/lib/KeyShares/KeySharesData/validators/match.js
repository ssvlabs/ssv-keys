"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchLengthValidator = exports.MatchLengthValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const operator_1 = require("../../../exceptions/operator");
let MatchLengthValidatorConstraint = class MatchLengthValidatorConstraint {
    validate(value, args) {
        const [relatedPropertyName, customError] = args.constraints;
        const relatedLength = args.object[relatedPropertyName].length;
        if (!Array.isArray(value)) {
            Object.values(value).forEach((arr) => {
                if (relatedLength !== arr.length) {
                    throw new operator_1.OperatorsCountsMismatchError(args.object[relatedPropertyName], value, customError.message);
                }
            });
        }
        else {
            if (relatedLength !== value.length) {
                throw new operator_1.OperatorsCountsMismatchError(args.object[relatedPropertyName], value, customError.message);
            }
        }
        return true;
    }
    defaultMessage() {
        return 'The length of the entries lists are not equal';
    }
};
MatchLengthValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'matchLength', async: false })
], MatchLengthValidatorConstraint);
exports.MatchLengthValidatorConstraint = MatchLengthValidatorConstraint;
function MatchLengthValidator(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property, validationOptions],
            validator: MatchLengthValidatorConstraint,
        });
    };
}
exports.MatchLengthValidator = MatchLengthValidator;
//# sourceMappingURL=match.js.map