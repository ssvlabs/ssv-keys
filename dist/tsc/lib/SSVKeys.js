"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeys = void 0;
const tslib_1 = require("tslib");
const atob_1 = tslib_1.__importDefault(require("atob"));
const web3_1 = tslib_1.__importDefault(require("web3"));
const js_base64_1 = require("js-base64");
const eth2_keystore_js_1 = tslib_1.__importDefault(require("eth2-keystore-js"));
const Threshold_1 = tslib_1.__importDefault(require("./Threshold"));
const Encryption_1 = tslib_1.__importDefault(require("./Encryption/Encryption"));
class SSVKeys {
    constructor() {
        this.web3Instances = {};
    }
    getWeb3(nodeUrl = process.env.NODE_URL || '') {
        if (!this.web3Instances[nodeUrl]) {
            this.web3Instances[nodeUrl] = new web3_1.default(String(nodeUrl || ''));
        }
        return this.web3Instances[nodeUrl];
    }
    /**
     * Extract private key from keystore data using keystore password.
     * Generally can be used in browsers when the keystore data has been provided by browser.
     * @param data
     * @param password
     */
    getPrivateKeyFromKeystoreData(data, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    // Try to json parse the data before
                    data = JSON.parse(data);
                    // eslint-disable-next-line no-empty
                }
                catch (e) { }
                const keyStore = new eth2_keystore_js_1.default(data);
                return yield keyStore.getPrivateKey(password).then((privateKey) => privateKey);
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Build threshold using private key for number of participants and failed participants.
     * TODO: make it possible to choose how many fails can be in threshold
     * @param privateKey
     */
    createThreshold(privateKey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const threshold = new Threshold_1.default();
                return threshold.create(privateKey);
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Encrypt operators shares using operators public keys.
     * @param operatorsPublicKeys
     * @param shares
     * @param operatorFormat
     */
    encryptShares(operatorsPublicKeys, shares, operatorFormat = SSVKeys.OPERATOR_FORMAT_BASE64) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const decodedOperators = operatorsPublicKeys.map((operator) => {
                    operator = (0, atob_1.default)(operator);
                    return operatorFormat == SSVKeys.OPERATOR_FORMAT_BASE64
                        ? String((0, js_base64_1.encode)(operator)) : operator;
                });
                return new Encryption_1.default(decodedOperators, shares).encrypt();
            }
            catch (error) {
                return error;
            }
        });
    }
    /**
     * Encode with Web3 eth abi method any fields of shares array required for transaction.
     * @param encryptedShares
     * @param field
     */
    abiEncode(encryptedShares, field) {
        return encryptedShares.map((share) => {
            return this.getWeb3().eth.abi.encodeParameter('string', Object(share)[field]);
        });
    }
    /**
     * Having keystore private key build final transaction payload for list of operators IDs from contract.
     *
     * Example:
     *
     *    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreFile(keystoreFilePath, keystorePassword);
     *    const encryptedShares = await ssvKeys.encryptShares(operatorsPublicKeys, shares);
     *    await ssvKeys.buildPayloadV2(...)
     *
     * @param privateKey
     * @param operatorsIds
     * @param encryptedShares
     * @param tokenAmount
     */
    buildPayload(privateKey, operatorsIds, encryptedShares, tokenAmount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const threshold = yield this.createThreshold(privateKey);
            const sharePublicKey = encryptedShares.map((share) => share.publicKey);
            const sharePrivateKey = this.abiEncode(encryptedShares, 'privateKey');
            return [
                threshold.validatorPublicKey,
                `[${operatorsIds.join(',')}]`,
                sharePublicKey,
                sharePrivateKey,
                tokenAmount,
            ];
        });
    }
}
exports.SSVKeys = SSVKeys;
SSVKeys.OPERATOR_FORMAT_BASE64 = 'base64';
//# sourceMappingURL=SSVKeys.js.map