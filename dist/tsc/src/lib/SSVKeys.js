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
     * @param privateKey
     * @param operators
     */
    createThreshold(privateKey, operators) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const threshold = new Threshold_1.default();
                return threshold.create(privateKey, operators);
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
     * @param sharesFormat
     */
    encryptShares(operatorsPublicKeys, shares, sharesFormat = '') {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const decodedOperators = operatorsPublicKeys.map((operator) => String((0, js_base64_1.encode)((0, atob_1.default)(operator))));
                const encryptedShares = new Encryption_1.default(decodedOperators, shares).encrypt();
                return encryptedShares.map((share) => {
                    share.operatorPublicKey = (0, js_base64_1.encode)(share.operatorPublicKey);
                    if (sharesFormat === SSVKeys.SHARES_FORMAT_ABI) {
                        share.operatorPublicKey = this.getWeb3().eth.abi.encodeParameter('string', share.operatorPublicKey);
                        share.privateKey = this.getWeb3().eth.abi.encodeParameter('string', share.privateKey);
                    }
                    return share;
                });
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
            const value = Object(share)[field];
            if (String(value).startsWith('0x')) {
                return value;
            }
            return this.getWeb3().eth.abi.encodeParameter('string', value);
        });
    }
    /**
     * Having keystore private key build final transaction payload for list of operators IDs from contract.
     *
     * Example:
     *
     *    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreFile(keystoreFilePath, keystorePassword);
     *    const encryptedShares = await ssvKeys.encryptShares(...);
     *    await ssvKeys.buildPayload(...)
     *
     * @param validatorPublicKey
     * @param operatorsIds
     * @param encryptedShares
     * @param ssvAmount
     */
    buildPayload(validatorPublicKey, operatorsIds, encryptedShares, ssvAmount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sharePublicKeys = encryptedShares.map((share) => share.publicKey);
            const sharePrivateKeys = this.abiEncode(encryptedShares, 'privateKey');
            return [
                validatorPublicKey,
                operatorsIds.join(','),
                sharePublicKeys,
                sharePrivateKeys,
                ssvAmount,
            ];
        });
    }
}
exports.SSVKeys = SSVKeys;
SSVKeys.SHARES_FORMAT_ABI = 'abi';
//# sourceMappingURL=SSVKeys.js.map