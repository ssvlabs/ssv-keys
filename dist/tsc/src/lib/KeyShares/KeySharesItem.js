"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesItem = void 0;
const tslib_1 = require("tslib");
const ethers = tslib_1.__importStar(require("ethers"));
const web3Helper = tslib_1.__importStar(require("../helpers/web3.helper"));
const class_validator_1 = require("class-validator");
const KeySharesData_1 = require("./KeySharesData/KeySharesData");
const KeySharesPayload_1 = require("./KeySharesData/KeySharesPayload");
const operator_helper_1 = require("../helpers/operator.helper");
const keystore_1 = require("../exceptions/keystore");
const base_1 = require("../../lib/exceptions/base");
const SIGNATURE_LENGHT = 192;
const PUBLIC_KEY_LENGHT = 96;
/**
 * Key shares file data interface.
 */
class KeySharesItem {
    constructor() {
        this.error = null;
        this.data = new KeySharesData_1.KeySharesData();
        this.payload = new KeySharesPayload_1.KeySharesPayload();
    }
    /**
     * Build payload from operators list, encrypted shares and validator public key
     * @param publicKey
     * @param operatorIds
     * @param encryptedShares
     */
    buildPayload(metaData, toSignatureData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { ownerAddress, ownerNonce, privateKey, } = toSignatureData;
            if (!Number.isInteger(ownerNonce) || ownerNonce < 0) {
                throw new keystore_1.OwnerNonceFormatError(ownerNonce, 'Owner nonce is not positive integer');
            }
            let address;
            try {
                address = web3Helper.web3.utils.toChecksumAddress(ownerAddress);
            }
            catch (_a) {
                throw new keystore_1.OwnerAddressFormatError(ownerAddress, 'Owner address is not a valid Ethereum address');
            }
            const payload = this.payload.build({
                publicKey: metaData.publicKey,
                operatorIds: (0, operator_helper_1.operatorSortedList)(metaData.operators).map(operator => operator.id),
                encryptedShares: metaData.encryptedShares,
            });
            const signature = yield web3Helper.buildSignature(`${address}:${ownerNonce}`, privateKey);
            const signSharesBytes = web3Helper.hexArrayToBytes([signature, payload.sharesData]);
            payload.sharesData = `0x${signSharesBytes.toString('hex')}`;
            // verify signature
            yield this.validateSingleShares(payload.sharesData, {
                ownerAddress,
                ownerNonce,
                publicKey: yield web3Helper.privateToPublicKey(privateKey),
            });
            return payload;
        });
    }
    validateSingleShares(shares, fromSignatureData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { ownerAddress, ownerNonce, publicKey } = fromSignatureData;
            if (!Number.isInteger(ownerNonce) || ownerNonce < 0) {
                throw new keystore_1.OwnerNonceFormatError(ownerNonce, 'Owner nonce is not positive integer');
            }
            const address = web3Helper.web3.utils.toChecksumAddress(ownerAddress);
            const signaturePt = shares.replace('0x', '').substring(0, SIGNATURE_LENGHT);
            yield web3Helper.validateSignature(`${address}:${ownerNonce}`, `0x${signaturePt}`, publicKey);
        });
    }
    /**
     * Build shares from bytes string and operators list length
     * @param bytes
     * @param operatorCount
     */
    buildSharesFromBytes(bytes, operatorCount) {
        // Validate the byte string format (hex string starting with '0x')
        if (!bytes.startsWith('0x') || !/^(0x)?[0-9a-fA-F]*$/.test(bytes)) {
            throw new base_1.SSVKeysException('Invalid byte string format');
        }
        // Validate the operator count (positive integer)
        if (operatorCount <= 0 || !Number.isInteger(operatorCount)) {
            throw new base_1.SSVKeysException('Invalid operator count');
        }
        const sharesPt = bytes.replace('0x', '').substring(SIGNATURE_LENGHT);
        const pkSplit = sharesPt.substring(0, operatorCount * PUBLIC_KEY_LENGHT);
        const pkArray = ethers.utils.arrayify('0x' + pkSplit);
        const sharesPublicKeys = this.splitArray(operatorCount, pkArray)
            .map(item => ethers.utils.hexlify(item));
        const eSplit = bytes.substring(operatorCount * PUBLIC_KEY_LENGHT);
        const eArray = ethers.utils.arrayify('0x' + eSplit);
        const encryptedKeys = this.splitArray(operatorCount, eArray).map(item => Buffer.from(ethers.utils.hexlify(item).replace('0x', ''), 'hex').toString('base64'));
        return { sharesPublicKeys, encryptedKeys };
    }
    /**
     * Updates the current instance with partial data and payload, and validates.
     * @param data Partial key shares data.
     * @param payload Partial key shares payload.
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
     * Stringify key shares to be ready for saving in file.
     */
    toJson() {
        return JSON.stringify({
            data: this.data || null,
            payload: this.payload || null,
        }, null, 2);
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
     * Initialise from JSON or object data.
     */
    static fromJson(content) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = typeof content === 'string' ? JSON.parse(content) : content;
            const instance = new KeySharesItem();
            try {
                instance.data.update(body.data);
                instance.payload.update(body.payload);
                instance.validate();
                // Custom validation: verify signature
                yield instance.validateSingleShares(instance.payload.sharesData, {
                    ownerAddress: instance.data.ownerAddress,
                    ownerNonce: instance.data.ownerNonce,
                    publicKey: instance.data.publicKey,
                });
            }
            catch (e) {
                instance.error = e;
            }
            return instance;
        });
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeySharesItem.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeySharesItem.prototype, "payload", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)()
], KeySharesItem.prototype, "error", void 0);
exports.KeySharesItem = KeySharesItem;
//# sourceMappingURL=KeySharesItem.js.map