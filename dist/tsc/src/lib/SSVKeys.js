"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeys = void 0;
const tslib_1 = require("tslib");
// import atob from 'atob';
const BLS_1 = tslib_1.__importDefault(require("./BLS"));
const KeyShares_1 = require("./KeyShares/KeyShares");
const Threshold_1 = tslib_1.__importDefault(require("./Threshold"));
const EthereumKeyStore_1 = tslib_1.__importDefault(require("./EthereumKeyStore/EthereumKeyStore"));
const Encryption_1 = tslib_1.__importDefault(require("./Encryption/Encryption"));
/**
 * SSVKeys class provides high-level methods to easily work with entire flow:
 *  - getting private key from keystore file using password
 *  - creating shares threshold
 *  - creating final shares
 *  - building final payload which is ready to be used in web3 transaction
 */
class SSVKeys {
    constructor() {
        this.version = SSVKeys.VERSION.V3;
        this.keySharesInstance = new KeyShares_1.KeyShares();
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
    createThreshold(privateKey, operatorIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.threshold = yield new Threshold_1.default().create(privateKey, operatorIds);
            return this.threshold;
        });
    }
    /**
     * Encrypt operators shares using operators public keys.
     * @param operatorsPublicKeys
     * @param shares
     * @param sharesFormat
     */
    encryptShares(operatorsPublicKeys, shares) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const decodedOperatorPublicKeys = operatorsPublicKeys.map((operator) => Buffer.from(operator, 'base64').toString());
            const encryptedShares = new Encryption_1.default(decodedOperatorPublicKeys, shares).encrypt();
            return encryptedShares;
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
            if (operatorIds.length !== operatorPublicKeys.length) {
                throw Error('Mismatch amount of operator ids and operator keys.');
            }
            const operators = operatorIds
                .map((id, index) => ({ id, publicKey: operatorPublicKeys[index] }))
                .sort((a, b) => +a.id - +b.id);
            const threshold = yield this.createThreshold(privateKey, operators.map(item => item.id));
            return this.encryptShares(operators.map(item => item.publicKey), threshold.shares);
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
     */
    buildPayload(metaData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.keyShares.generateContractPayload({
                publicKey: metaData.publicKey,
                operatorIds: [...metaData.operatorIds].sort((a, b) => a - b),
                encryptedShares: metaData.encryptedShares,
            });
        });
    }
    /**
     * Build payload from keyshares file with operators and shares details inside.
     * @param keyShares
     */
    buildPayloadFromKeyShares(keyShares) {
        var _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const publicKeys = ((_b = (_a = keyShares.data) === null || _a === void 0 ? void 0 : _a.shares) === null || _b === void 0 ? void 0 : _b.publicKeys) || [];
            const publicKey = (_c = keyShares.data) === null || _c === void 0 ? void 0 : _c.publicKey;
            const encryptedKeys = ((_e = (_d = keyShares.data) === null || _d === void 0 ? void 0 : _d.shares) === null || _e === void 0 ? void 0 : _e.encryptedKeys) || [];
            const operatorPublicKeys = (_f = keyShares.data.operators) === null || _f === void 0 ? void 0 : _f.map((item) => item.publicKey);
            const operatorIds = (_g = keyShares.data.operators) === null || _g === void 0 ? void 0 : _g.map((item) => item.id);
            const operators = operatorIds
                .map((id, index) => ({ id, publicKey: operatorPublicKeys[index] }))
                .sort((a, b) => +a.id - +b.id);
            if (publicKeys.length !== encryptedKeys.length
                || publicKeys.length !== operatorPublicKeys.length
                || encryptedKeys.length !== operatorPublicKeys.length
                || !encryptedKeys.length
                || !operatorPublicKeys.length
                || !publicKeys.length) {
                throw Error('Operator public keys and shares public/encrypted keys length does not match or have zero length.');
            }
            return this.keyShares.generateContractPayload({
                publicKey,
                operatorIds: operators.map(item => item.id),
                encryptedShares: publicKeys.map((item, index) => ({
                    publicKey: item,
                    privateKey: encryptedKeys[index],
                })),
            });
        });
    }
}
exports.SSVKeys = SSVKeys;
SSVKeys.SHARES_FORMAT_ABI = 'abi';
SSVKeys.VERSION = {
    V3: 'v3',
};
//# sourceMappingURL=SSVKeys.js.map