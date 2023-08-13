"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const ethers = tslib_1.__importStar(require("ethers"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const web3Helper = tslib_1.__importStar(require("../helpers/web3.helper"));
const package_json_1 = tslib_1.__importDefault(require("../../../package.json"));
const class_validator_1 = require("class-validator");
const KeySharesData_1 = require("./KeySharesData/KeySharesData");
const KeySharesPayload_1 = require("./KeySharesData/KeySharesPayload");
const operator_helper_1 = require("../helpers/operator.helper");
const keystore_1 = require("../exceptions/keystore");
const SIGNATURE_LENGHT = 192;
const PUBLIC_KEY_LENGHT = 96;
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
            const { ownerAddress, ownerNonce, publicKey, } = fromSignatureData;
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
        const sharesPt = bytes.replace('0x', '').substring(SIGNATURE_LENGHT);
        const pkSplit = sharesPt.substring(0, operatorCount * PUBLIC_KEY_LENGHT);
        const pkArray = ethers.getBytes('0x' + pkSplit);
        const sharesPublicKeys = this._splitArray(operatorCount, pkArray).map(item => ethers.hexlify(item));
        const eSplit = bytes.substring(operatorCount * PUBLIC_KEY_LENGHT);
        const eArray = ethers.getBytes('0x' + eSplit);
        const encryptedKeys = this._splitArray(operatorCount, eArray).map(item => Buffer.from(ethers.hexlify(item).replace('0x', ''), 'hex').toString('base64'));
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
        const body = typeof content === 'string' ? JSON.parse(content) : content;
        const extVersion = semver_1.default.parse(body.version);
        const currentVersion = semver_1.default.parse(package_json_1.default.version);
        if (!extVersion || !currentVersion) {
            throw new Error(`The file for keyshares must contain a version mark provided by ssv-keys.`);
        }
        if (!extVersion || (currentVersion.major !== extVersion.major) || (currentVersion.minor !== extVersion.minor)) {
            throw new Error(`The keyshares file you are attempting to reuse does not have the same version (v${package_json_1.default.version}) as supported by ssv-keys`);
        }
        this.update(body.data);
        return this;
    }
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson() {
        return JSON.stringify({
            version: `v${package_json_1.default.version}`,
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
exports.KeyShares = KeyShares;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "payload", void 0);
//# sourceMappingURL=KeyShares.js.map