"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeysV2 = void 0;
const tslib_1 = require("tslib");
const SSVKeys_1 = require("./SSVKeys");
class SSVKeysV2 extends SSVKeys_1.SSVKeys {
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
     * @param tokenAmountGwei
     */
    buildPayloadV2(privateKey, operatorsIds, encryptedShares, tokenAmountGwei) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const threshold = yield this.createThreshold(privateKey);
            const sharePublicKey = encryptedShares.map((share) => share.publicKey);
            const sharePrivateKey = this.abiEncode(encryptedShares, 'privateKey');
            return [
                threshold.validatorPublicKey,
                `[${operatorsIds.join(',')}]`,
                sharePublicKey,
                sharePrivateKey,
                tokenAmountGwei,
            ];
        });
    }
}
exports.SSVKeysV2 = SSVKeysV2;
//# sourceMappingURL=SSVKeysV2.js.map