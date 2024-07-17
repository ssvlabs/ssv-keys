"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesPayload = void 0;
const tslib_1 = require("tslib");
const web3_helper_1 = require("../../helpers/web3.helper");
const class_validator_1 = require("class-validator");
const validators_1 = require("./validators");
/**
 * Key Shares Payload
 */
class KeySharesPayload {
    /**
     * Converts arrays of public and private keys to a single hexadecimal string.
     * @param publicKeys Array of public keys.
     * @param privateKeys Array of private keys.
     * @returns Hexadecimal string representation of keys.
     */
    _sharesToBytes(publicKeys, privateKeys) {
        const encryptedShares = [...privateKeys].map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
        const pkPsBytes = (0, web3_helper_1.hexArrayToBytes)([...publicKeys, ...encryptedShares]);
        return `0x${pkPsBytes.toString('hex')}`;
    }
    /**
     * Updates the payload with new data and validates it.
     * @param data Partial key shares payload to update.
     */
    update(data) {
        this.publicKey = data.publicKey;
        this.sharesData = data.sharesData;
        this.operatorIds = data.operatorIds;
        this.validate();
    }
    /**
     * Validates the current state of the instance.
     * @returns {void | ValidationError[]} Validation errors if any, otherwise undefined.
     */
    validate() {
        (0, class_validator_1.validateSync)(this);
    }
    /**
     * Builds the payload from the given data.
     * @param data Data to build the payload.
     * @returns {KeySharesPayload} The current instance for chaining.
     */
    build(data) {
        this.publicKey = data.publicKey;
        this.operatorIds = data.operatorIds;
        this.sharesData = this._sharesToBytes(data.encryptedShares.map((share) => share.publicKey), data.encryptedShares.map((share) => share.privateKey));
        return this;
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)()
], KeySharesPayload.prototype, "sharesData", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(98, 98),
    (0, validators_1.PublicKeyValidator)()
], KeySharesPayload.prototype, "publicKey", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)({}, { each: true })
], KeySharesPayload.prototype, "operatorIds", void 0);
exports.KeySharesPayload = KeySharesPayload;
//# sourceMappingURL=KeySharesPayload.js.map