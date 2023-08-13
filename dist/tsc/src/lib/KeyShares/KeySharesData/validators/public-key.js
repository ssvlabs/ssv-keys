"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKeyValidator = exports.PublicKeyValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const BLS_1 = tslib_1.__importDefault(require("../../../BLS"));
const class_validator_1 = require("class-validator");
const bls_1 = require("../../../exceptions/bls");
/* Try to BLS deserialize validator public key. */
let PublicKeyValidatorConstraint = exports.PublicKeyValidatorConstraint = class PublicKeyValidatorConstraint {
    validate(value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof value === 'string') {
                    BLS_1.default.deserializeHexStrToPublicKey(value.replace('0x', ''));
                }
                else {
                    value.forEach((item) => BLS_1.default.deserializeHexStrToPublicKey(item.replace('0x', '')));
                }
            }
            catch (e) {
                throw new bls_1.BLSDeserializeError(value, 'Failed to BLS deserialize validator public key');
            }
            return true;
        });
    }
    defaultMessage() {
        return 'Invalid public key';
    }
};
exports.PublicKeyValidatorConstraint = PublicKeyValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'publicKey', async: true })
], PublicKeyValidatorConstraint);
function PublicKeyValidator(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: PublicKeyValidatorConstraint,
        });
    };
}
exports.PublicKeyValidator = PublicKeyValidator;
//# sourceMappingURL=public-key.js.map