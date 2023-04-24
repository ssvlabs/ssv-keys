"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesPayloadV3 = void 0;
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const ethers = tslib_1.__importStar(require("ethers"));
const class_validator_1 = require("class-validator");
/**
 * Key Shares Payload
 */
class KeySharesPayloadV3 {
    constructor() {
        this.readable = null;
    }
    decodeRSAShares(arr) {
        return arr.map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
    }
    sharesToBytes(publicKeys, privateKeys) {
        const encryptedShares = this.decodeRSAShares([...privateKeys]);
        const arrayPublicKeys = new Uint8Array(publicKeys.map(pk => [...ethers.utils.arrayify(pk)]).flat());
        const arrayEncryptedShares = new Uint8Array(encryptedShares.map(sh => [...ethers.utils.arrayify(sh)]).flat());
        // public keys hex encoded
        const pkHex = ethers.utils.hexlify(arrayPublicKeys);
        // length of the public keys (hex), hex encoded
        const pkHexLength = String(pkHex.length.toString(16)).padStart(4, '0');
        // join arrays
        const pkPsBytes = Buffer.concat([arrayPublicKeys, arrayEncryptedShares]);
        // add length of the public keys at the beginning
        // this is the variable that is sent to the contract as bytes, prefixed with 0x
        return `0x${pkHexLength}${pkPsBytes.toString('hex')}`;
    }
    build(data) {
        return [
            data.publicKey,
            data.operatorIds,
            this.sharesToBytes(data.encryptedShares.map((share) => share.publicKey), data.encryptedShares.map((share) => share.privateKey)),
        ];
    }
    /**
     * Setting data in array or object format or cleaning it up.
     * @param data
     */
    setData(data) {
        // Cleanup
        if (!data === null) {
            this.readable = null;
            return;
        }
        // Payload array
        if (underscore_1.default.isArray(data)) {
            this.readable = this.toReadable(data);
            return;
        }
        // Payload object (typically from key shares file)
        if (underscore_1.default.isObject(data)) {
            if (data.readable) {
                this.readable = data.readable;
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
            publicKey: payload[KeySharesPayloadV3.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
            operatorIds: payload[KeySharesPayloadV3.PAYLOAD_INDEX_OPERATOR_IDS],
            shares: payload[KeySharesPayloadV3.PAYLOAD_INDEX_SHARES_KEYS],
            amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
            cluster: 'The latest cluster snapshot data, obtained using the cluster-scanner tool. If this is the cluster\'s 1st validator then use - {0,0,0,0,true}',
        };
    }
    validate() {
        // Find out how final payload can be validated.
    }
}
KeySharesPayloadV3.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
KeySharesPayloadV3.PAYLOAD_INDEX_OPERATOR_IDS = 1;
KeySharesPayloadV3.PAYLOAD_INDEX_SHARES_KEYS = 2;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)()
], KeySharesPayloadV3.prototype, "readable", void 0);
exports.KeySharesPayloadV3 = KeySharesPayloadV3;
//# sourceMappingURL=KeySharesPayloadV3.js.map