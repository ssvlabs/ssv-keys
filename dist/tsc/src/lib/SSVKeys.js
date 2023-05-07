"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeys = void 0;
const tslib_1 = require("tslib");
// import atob from 'atob';
const BLS_1 = tslib_1.__importDefault(require("./BLS"));
const Threshold_1 = tslib_1.__importDefault(require("./Threshold"));
const EthereumKeyStore_1 = tslib_1.__importDefault(require("./EthereumKeyStore/EthereumKeyStore"));
const Encryption_1 = tslib_1.__importDefault(require("./Encryption/Encryption"));
const operator_helper_1 = require("./helpers/operator.helper");
/**
 * SSVKeys class provides high-level methods to easily work with entire flow:
 *  - getting private key from keystore file using password
 *  - creating shares threshold
 *  - creating final shares
 *  - building final payload which is ready to be used in web3 transaction
 */
class SSVKeys {
    /**
     * Extract private key from keystore data using keystore password.
     * Generally can be used in browsers when the keystore data has been provided by browser.
     * @param data
     * @param password
     */
    extractKeys(data, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const privateKey = yield new EthereumKeyStore_1.default(data).getPrivateKey(password);
            yield BLS_1.default.init(BLS_1.default.BLS12_381);
            return {
                privateKey: `0x${privateKey}`,
                publicKey: `0x${BLS_1.default.deserializeHexStrToSecretKey(privateKey).getPublicKey().serializeToHexStr()}`
            };
        });
    }
    /**
     * Build threshold using private key and list of operators.
     * @param privateKey
     * @param operators
     */
    createThreshold(privateKey, operators) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sortedOperators = (0, operator_helper_1.operatorSortedList)(operators);
            this.threshold = yield new Threshold_1.default().create(privateKey, sortedOperators.map(item => item.id));
            return this.threshold;
        });
    }
    /**
     * Encrypt operators shares using operators list (id, publicKey).
     * @param operators
     * @param shares
     */
    encryptShares(operators, shares) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const sortedOperators = (0, operator_helper_1.operatorSortedList)(operators);
            const decodedOperatorPublicKeys = sortedOperators.map(item => Buffer.from(item.publicKey, 'base64').toString());
            return new Encryption_1.default(decodedOperatorPublicKeys, shares).encrypt();
        });
    }
    /**
     * Build shares from private key, operators list
     * @param privateKey
     * @param operators
     */
    buildShares(privateKey, operators) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const threshold = yield this.createThreshold(privateKey, operators);
            return this.encryptShares(operators, threshold.shares);
        });
    }
    /**
     * Getting threshold if it has been created before.
     */
    getThreshold() {
        return this.threshold;
    }
}
exports.SSVKeys = SSVKeys;
SSVKeys.SHARES_FORMAT_ABI = 'abi';
//# sourceMappingURL=SSVKeys.js.map