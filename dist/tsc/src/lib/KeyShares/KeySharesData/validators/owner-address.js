"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerAddressValidator = exports.OwnerAddressValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const web3_helper_1 = require("../../../helpers/web3.helper");
const keystore_1 = require("../../../exceptions/keystore");
/* Try to validate ethereum owner address. */
let OwnerAddressValidatorConstraint = class OwnerAddressValidatorConstraint {
    validate(value) {
        try {
            (0, web3_helper_1.toChecksumAddress)(value);
        }
        catch {
            throw new keystore_1.OwnerAddressFormatError(value, 'Owner address is not a valid Ethereum address');
        }
        return true;
    }
    defaultMessage() {
        return 'Invalid owner address';
    }
};
OwnerAddressValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ownerAddress', async: false })
], OwnerAddressValidatorConstraint);
exports.OwnerAddressValidatorConstraint = OwnerAddressValidatorConstraint;
function OwnerAddressValidator(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: OwnerAddressValidatorConstraint,
        });
    };
}
exports.OwnerAddressValidator = OwnerAddressValidator;
//# sourceMappingURL=owner-address.js.map