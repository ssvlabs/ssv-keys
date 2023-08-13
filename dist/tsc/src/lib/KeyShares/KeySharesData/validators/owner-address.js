"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerAddressValidator = exports.OwnerAddressValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const web3Helper = tslib_1.__importStar(require("../../../helpers/web3.helper"));
const keystore_1 = require("../../../exceptions/keystore");
/* Try to validate ethereum owner address. */
let OwnerAddressValidatorConstraint = exports.OwnerAddressValidatorConstraint = class OwnerAddressValidatorConstraint {
    validate(value) {
        try {
            web3Helper.web3.utils.toChecksumAddress(value);
        }
        catch (_a) {
            throw new keystore_1.OwnerAddressFormatError(value, 'Owner address is not a valid Ethereum address');
        }
        return true;
    }
    defaultMessage() {
        return 'Invalid owner address';
    }
};
exports.OwnerAddressValidatorConstraint = OwnerAddressValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'ownerAddress', async: false })
], OwnerAddressValidatorConstraint);
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