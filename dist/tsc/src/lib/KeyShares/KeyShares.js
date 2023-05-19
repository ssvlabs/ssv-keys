"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const ethers = tslib_1.__importStar(require("ethers"));
const class_validator_1 = require("class-validator");
const web3Helper = tslib_1.__importStar(require("../helpers/web3.helper"));
const KeySharesData_1 = require("./KeySharesData/KeySharesData");
const KeySharesPayload_1 = require("./KeySharesData/KeySharesPayload");
const operator_helper_1 = require("../helpers/operator.helper");
/**
 * Key shares file data interface.
 */
class KeyShares {
    constructor() {
        this.data = new KeySharesData_1.KeySharesData();
        this.payload = new KeySharesPayload_1.KeySharesPayload();
    }
    /**
     * Build payload from operators list, encrypted shares and validator public key
     * @param publicKey
     * @param operatorIds
     * @param encryptedShares
     */
    buildPayload(metaData, signatureData) {
        const payload = this.payload.build({
            publicKey: metaData.publicKey,
            operatorIds: (0, operator_helper_1.operatorSortedList)(metaData.operators).map(operator => operator.id),
            encryptedShares: metaData.encryptedShares,
        });
        const { ownerAddress, ownerNonce, privateKey, } = signatureData;
        const signature = web3Helper.buildSignature(`${web3Helper.web3.utils.toChecksumAddress(ownerAddress)}:${ownerNonce}`, privateKey);
        const signSharesBytes = web3Helper.hexArrayToBytes([signature, payload.shares]);
        payload.shares = `0x${signSharesBytes.toString('hex')}`;
        return payload;
    }
    /**
     * Build shares from bytes string and operators list length
     * @param bytes
     * @param operatorCount
     */
    buildSharesFromBytes(bytes, operatorCount) {
        bytes = bytes.replace('0x', '');
        const pkLength = parseInt(bytes.substring(0, 4), 16);
        // get the public keys part
        const pkSplit = bytes.substring(4, pkLength + 2);
        const pkArray = ethers.utils.arrayify('0x' + pkSplit);
        const sharesPublicKeys = this._splitArray(operatorCount, pkArray).map(item => ethers.utils.hexlify(item));
        const eSplit = bytes.substring(pkLength + 2);
        const eArray = ethers.utils.arrayify('0x' + eSplit);
        const encryptedKeys = this._splitArray(operatorCount, eArray).map(item => Buffer.from(ethers.utils.hexlify(item).replace('0x', ''), 'hex').toString('base64'));
        return {
            sharesPublicKeys,
            encryptedKeys,
        };
    }
    /**
     * Set new data and validate it.
     * @param data
     */
    update(data) {
        this.data.update(data);
        this.validate();
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
    fromJson(content) {
        const data = typeof content === 'string'
            ? JSON.parse(content).data
            : content.data;
        this.update(data);
        return this;
    }
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson() {
        return JSON.stringify({
            version: 'v3',
            createdAt: new Date().toISOString(),
            data: this.data || null,
            payload: this.payload.readable || null,
        }, null, '  ');
    }
    _splitArray(parts, arr) {
        const partLength = Math.floor(arr.length / parts);
        const partsArr = [];
        for (let i = 0; i < parts; i++) {
            const start = i * partLength;
            const end = start + partLength;
            partsArr.push(arr.slice(start, end));
        }
        return partsArr;
    }
}
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