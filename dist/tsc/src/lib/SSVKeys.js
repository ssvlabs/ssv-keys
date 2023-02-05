"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeys = void 0;
const tslib_1 = require("tslib");
const atob_1 = tslib_1.__importDefault(require("atob"));
const BLS_1 = tslib_1.__importDefault(require("./BLS"));
const js_base64_1 = require("js-base64");
const KeyShares_1 = require("./KeyShares/KeyShares");
const Threshold_1 = tslib_1.__importDefault(require("./Threshold"));
const EthereumKeyStore_1 = tslib_1.__importDefault(require("./EthereumKeyStore/EthereumKeyStore"));
const Encryption_1 = tslib_1.__importDefault(require("./Encryption/Encryption"));
const web3_helper_1 = require("./helpers/web3.helper");
const Snapshot_1 = tslib_1.__importDefault(require("./ClusterScanner/Snapshot"));
/**
 * SSVKeys class provides high-level methods to easily work with entire flow:
 *  - getting private key from keystore file using password
 *  - creating shares threshold
 *  - creating final shares
 *  - building final payload which is ready to be used in web3 transaction
 */
class SSVKeys {
    constructor(ver) {
        if (!Object.values(SSVKeys.VERSION).includes(ver)) {
            throw Error('Version is not supported');
        }
        this.version = ver;
        this.keySharesInstance = new KeyShares_1.KeyShares({ version: this.version });
    }
    get keyShares() {
        return this.keySharesInstance;
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
                const privateKey = yield new EthereumKeyStore_1.default(data).getPrivateKey(password);
                yield BLS_1.default.init(BLS_1.default.BLS12_381);
                this.privateKey = `0x${BLS_1.default.deserializeHexStrToSecretKey(privateKey).serializeToHexStr()}`;
                this.publicKey = `0x${BLS_1.default.deserializeHexStrToSecretKey(privateKey).getPublicKey().serializeToHexStr()}`;
                return privateKey;
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
            this.threshold = yield new Threshold_1.default().create(privateKey, operators);
            return this.threshold;
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
                        share.operatorPublicKey = web3_helper_1.web3.eth.abi.encodeParameter('string', share.operatorPublicKey);
                        share.privateKey = web3_helper_1.web3.eth.abi.encodeParameter('string', share.privateKey);
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
     * Build shares from private key, operator IDs and public keys
     * @param privateKey
     * @param operatorIds
     * @param operatorPublicKeys
     */
    buildShares(privateKey, operatorIds, operatorPublicKeys) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const threshold = yield this.createThreshold(privateKey, operatorIds);
            return this.encryptShares(operatorPublicKeys, threshold.shares);
        });
    }
    /**
     * Getting threshold if it has been created before.
     */
    getThreshold() {
        return this.threshold;
    }
    /**
     * Build payload from encrypted shares, validator public key and operator IDs
     * @param publicKey
     * @param operatorIds
     * @param encryptedShares
     * @param amount
     */
    buildPayload(metaData, clusterScanParams) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const cluster = yield Snapshot_1.default.get(Object.assign(Object.assign({}, clusterScanParams), { operatorIds: metaData.operatorIds }));
            return this.keyShares.generateContractPayload({
                publicKey: metaData.publicKey,
                operatorIds: metaData.operatorIds,
                encryptedShares: metaData.encryptedShares,
                amount: metaData.amount,
                cluster,
            });
        });
    }
    /**
     * Build payload from keyshares file with operators and shares details inside.
     * If ssv amount is not provided - it will be taken from keyshares file if exist there or set to 0.
     * @param keyShares
     * @param amount
     */
    buildPayloadFromKeyShares(keyShares, amount, clusterScanParams) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const publicKeys = ((_b = (_a = keyShares.data) === null || _a === void 0 ? void 0 : _a.shares) === null || _b === void 0 ? void 0 : _b.publicKeys) || [];
            const publicKey = (_c = keyShares.data) === null || _c === void 0 ? void 0 : _c.publicKey;
            const encryptedKeys = ((_e = (_d = keyShares.data) === null || _d === void 0 ? void 0 : _d.shares) === null || _e === void 0 ? void 0 : _e.encryptedKeys) || [];
            const operatorPublicKeys = ((_f = keyShares.data) === null || _f === void 0 ? void 0 : _f.operatorPublicKeys) || [];
            const operatorIds = (_g = keyShares.data.operators) === null || _g === void 0 ? void 0 : _g.map((item) => item.id);
            if (publicKeys.length !== encryptedKeys.length
                || publicKeys.length !== operatorPublicKeys.length
                || encryptedKeys.length !== operatorPublicKeys.length
                || !encryptedKeys.length
                || !operatorPublicKeys.length
                || !publicKeys.length) {
                throw Error('Operator public keys and shares public/encrypted keys length does not match or have zero length.');
            }
            const cluster = yield Snapshot_1.default.get(Object.assign(Object.assign({}, clusterScanParams), { operatorIds }));
            return this.keyShares.generateContractPayload({
                publicKey,
                operatorIds,
                encryptedShares: publicKeys.map((item, index) => ({
                    publicKey: item,
                    privateKey: encryptedKeys[index],
                })),
                amount: amount || ((_j = (_h = keyShares.payload) === null || _h === void 0 ? void 0 : _h.readable) === null || _j === void 0 ? void 0 : _j.amount) || 0,
                cluster,
            });
        });
    }
}
exports.SSVKeys = SSVKeys;
SSVKeys.SHARES_FORMAT_ABI = 'abi';
SSVKeys.VERSION = {
    V2: 'v2',
    V3: 'v3',
};
//# sourceMappingURL=SSVKeys.js.map