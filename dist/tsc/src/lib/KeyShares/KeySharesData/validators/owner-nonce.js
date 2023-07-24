"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerNonceValidator = exports.OwnerNonceValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const keystore_1 = require("../../../exceptions/keystore");
/* Try to validate owner nonce. */
let OwnerNonceValidatorConstraint = class OwnerNonceValidatorConstraint {
    validate(value) {
        if (!Number.isInteger(value) || value < 0) {
            throw new keystore_1.OwnerNonceFormatError(value, 'Owner nonce is not positive integer');
        }
        return true;
    }
    defaultMessage() {
        return 'Invalid owner nonce';
    }
};
OwnerNonceValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ownerNonce', async: false })
], OwnerNonceValidatorConstraint);
exports.OwnerNonceValidatorConstraint = OwnerNonceValidatorConstraint;
function OwnerNonceValidator(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: OwnerNonceValidatorConstraint,
        });
    };
}
exports.OwnerNonceValidator = OwnerNonceValidator;
//# sourceMappingURL=owner-nonce.js.map