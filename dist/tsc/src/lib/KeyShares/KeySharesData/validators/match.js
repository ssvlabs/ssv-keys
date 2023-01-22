"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchLengthValidator = exports.MatchLengthValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
let MatchLengthValidatorConstraint = class MatchLengthValidatorConstraint {
    validate(value, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedLength = args.object[relatedPropertyName].length;
        return relatedLength === value.length;
    }
    defaultMessage() {
        return 'The length of the entries lists are not equal';
    }
};
MatchLengthValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'MatchLength', async: false })
], MatchLengthValidatorConstraint);
exports.MatchLengthValidatorConstraint = MatchLengthValidatorConstraint;
function MatchLengthValidator(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchLengthValidatorConstraint,
        });
    };
}
exports.MatchLengthValidator = MatchLengthValidator;
//# sourceMappingURL=match.js.map