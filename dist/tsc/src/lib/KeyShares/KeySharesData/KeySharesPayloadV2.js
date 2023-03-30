"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesPayloadV2 = void 0;
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const web3_helper_1 = require("../../helpers/web3.helper");
const class_validator_1 = require("class-validator");
/**
 * Key Shares Payload v2.
 */
class KeySharesPayloadV2 {
    constructor() {
        this.readable = null;
        this.raw = undefined;
    }
    build(data) {
        return [
            data.publicKey,
            data.operatorIds,
            data.encryptedShares.map((share) => share.publicKey),
            (0, web3_helper_1.abiEncode)(data.encryptedShares, 'privateKey'),
        ];
    }
    /**
     * Setting data in array or object format or cleaning it up.
     * @param data
     */
    setData(data) {
        // Cleanup
        if (!data === null) {
            this.raw = undefined;
            this.readable = null;
            return;
        }
        // Payload array
        if (underscore_1.default.isArray(data)) {
            this.raw = this.toRaw(data);
            this.readable = this.toReadable(data);
            return;
        }
        // Payload object (typically from key shares file)
        if (underscore_1.default.isObject(data)) {
            if (data.readable) {
                this.readable = data.readable;
            }
            if (data.raw) {
                this.raw = data.raw;
            }
        }
    }
    /**
     * Building raw payload for web3.
     * @param payload
     */
    toRaw(payload) {
        return payload.join(',');
    }
    /**
     * Building readable payload structure.
     * @param payload
     */
    toReadable(payload) {
        return {
            publicKey: payload[KeySharesPayloadV2.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
            operatorIds: payload[KeySharesPayloadV2.PAYLOAD_INDEX_OPERATOR_IDS],
            sharePublicKeys: payload[KeySharesPayloadV2.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS],
            sharePrivateKey: payload[KeySharesPayloadV2.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS],
            amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
        };
    }
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Find out how final payload can be validated.
        });
    }
}
KeySharesPayloadV2.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
KeySharesPayloadV2.PAYLOAD_INDEX_OPERATOR_IDS = 1;
KeySharesPayloadV2.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS = 2;
KeySharesPayloadV2.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS = 3;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)()
], KeySharesPayloadV2.prototype, "readable", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)()
], KeySharesPayloadV2.prototype, "raw", void 0);
exports.KeySharesPayloadV2 = KeySharesPayloadV2;
//# sourceMappingURL=KeySharesPayloadV2.js.map