"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const ethers = tslib_1.__importStar(require("ethers"));
const class_validator_1 = require("class-validator");
const KeySharesDataV3_1 = require("./KeySharesData/KeySharesDataV3");
const KeySharesPayloadV3_1 = require("./KeySharesData/KeySharesPayloadV3");
/**
 * Key shares file data interface.
 */
class KeyShares {
    /**
     * @param version
     */
    constructor() {
        // Versions of deeper structures
        this.byVersion = {
            'payload': {
                [KeyShares.VERSION_V3]: KeySharesPayloadV3_1.KeySharesPayloadV3,
            },
            'data': {
                [KeyShares.VERSION_V3]: KeySharesDataV3_1.KeySharesDataV3,
            }
        };
        this.version = KeyShares.VERSION_V3;
        this.data = this.getByVersion('data', this.version);
        this.payload = this.getByVersion('payload', this.version);
    }
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    generateContractPayload(data) {
        var _a;
        const payloadData = this.payload.build(data);
        (_a = this.payload) === null || _a === void 0 ? void 0 : _a.setData(payloadData);
        return this.payload;
    }
    generateKeySharesFromBytes(shares, operatorIds) {
        const operatorCount = operatorIds.length;
        shares = shares.replace('0x', '');
        const pkLength = parseInt(shares.substring(0, 4), 16);
        // get the public keys part
        const pkSplit = shares.substring(4, pkLength + 2);
        const pkArray = ethers.utils.arrayify('0x' + pkSplit);
        const sharesPublicKeys = this.splitArray(operatorCount, pkArray).map(item => ethers.utils.hexlify(item));
        const eSplit = shares.substring(pkLength + 2);
        const eArray = ethers.utils.arrayify('0x' + eSplit);
        const encryptedKeys = this.splitArray(operatorCount, eArray).map(item => Buffer.from(ethers.utils.hexlify(item).replace('0x', ''), 'hex').toString('base64'));
        return {
            sharesPublicKeys,
            encryptedKeys,
        };
    }
    splitArray(parts, arr) {
        const partLength = Math.floor(arr.length / parts);
        const partsArr = [];
        for (let i = 0; i < parts; i++) {
            const start = i * partLength;
            const end = start + partLength;
            partsArr.push(arr.slice(start, end));
        }
        return partsArr;
    }
    /**
     * Set new data and validate it.
     * @param data
     */
    setData(data) {
        if (!data) {
            return;
        }
        this.data.setData(data);
        this.validate();
    }
    /**
     * Get entity by version.
     * @param entity
     * @param version
     * @private
     */
    getByVersion(entity, version) {
        if (!this.byVersion[entity]) {
            throw Error(`"${entity}" is unknown entity`);
        }
        if (!this.byVersion[entity][version]) {
            throw Error(`"${entity}" is not supported in version of key shares: ${version}`);
        }
        return new this.byVersion[entity][version]();
    }
    /**
     * Validate everything
     */
    validate() {
        (0, class_validator_1.validateSync)(this);
    }
    /**
     * Initialise from JSON or object data.
     */
    fromJson(data) {
        // Parse json
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        this.setData(data.data);
        return this;
    }
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson() {
        return JSON.stringify({
            version: this.version,
            data: this.data || null,
            payload: this.payload || null,
            createdAt: new Date().toISOString()
        }, null, '  ');
    }
}
KeyShares.VERSION_V3 = 'v3';
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)()
], KeyShares.prototype, "version", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "payload", void 0);
exports.KeyShares = KeyShares;
//# sourceMappingURL=KeyShares.js.map