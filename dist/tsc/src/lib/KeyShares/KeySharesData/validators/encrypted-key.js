"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptedKeyValidator = exports.EncryptedKeyValidatorConstraint = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const js_base64_1 = require("js-base64");
const web3_helper_1 = require("../../../helpers/web3.helper");
const keyshares_1 = require("../../../exceptions/keyshares");
/* Try to BLS deserialize validator public key. */
let EncryptedKeyValidatorConstraint = class EncryptedKeyValidatorConstraint {
    validate(value) {
        let keyWithError = '';
        try {
            const encryptedKeys = Array.isArray(value) ? value : [value];
            encryptedKeys.forEach((key) => {
                keyWithError = key;
                (0, js_base64_1.decode)(key.startsWith('0x') ? (0, web3_helper_1.decodeParameter)('string', key) : key);
            });
        }
        catch (e) {
            throw new keyshares_1.KeySharesAbiDecodeError(keyWithError, `Filed ABI decode shares encrypted key. Error: ${e.message}`);
        }
        return true;
    }
    defaultMessage() {
        return 'Filed ABI decode shares encrypted key';
    }
};
EncryptedKeyValidatorConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'encryptedKey', async: false })
], EncryptedKeyValidatorConstraint);
exports.EncryptedKeyValidatorConstraint = EncryptedKeyValidatorConstraint;
function EncryptedKeyValidator(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: EncryptedKeyValidatorConstraint,
        });
    };
}
exports.EncryptedKeyValidator = EncryptedKeyValidator;
//# sourceMappingURL=encrypted-key.js.map