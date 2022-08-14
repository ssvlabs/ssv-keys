"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAction = void 0;
const tslib_1 = require("tslib");
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const BaseAction_1 = require("./BaseAction");
const SSVKeys_1 = require("../../lib/SSVKeys");
const keystore_1 = tslib_1.__importDefault(require("./arguments/keystore"));
const ssv_amount_1 = tslib_1.__importDefault(require("./arguments/ssv-amount"));
const KeyShares_1 = require("../../lib/KeyShares/KeyShares");
const operator_ids_1 = tslib_1.__importDefault(require("./arguments/operator-ids"));
const password_1 = tslib_1.__importDefault(require("./arguments/password"));
const output_folder_1 = tslib_1.__importDefault(require("./arguments/output-folder"));
const helpers_1 = require("../../lib/helpers");
const operator_public_keys_1 = tslib_1.__importDefault(require("./arguments/operator-public-keys"));
/**
 * Command to build keyshares from user input.
 */
class KeySharesAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'key-shares',
            shortAction: 'ksh',
            description: 'Generate shares for a list of operators from a validator keystore file',
            arguments: [
                keystore_1.default,
                password_1.default,
                operator_ids_1.default,
                operator_public_keys_1.default,
                ssv_amount_1.default,
                output_folder_1.default,
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { keystore, password, output_folder: outputFolder, ssv_token_amount: ssvAmount, } = this.args;
            let { operators_ids: operatorIds, operators_keys: operatorKeys, } = this.args;
            operatorKeys = operatorKeys.split(',');
            operatorIds = operatorIds.split(',').map((o) => parseInt(o, 10));
            const { payload, threshold, shares } = yield this.encryptShares(keystore, password, operatorIds, operatorKeys, ssvAmount);
            // Build keyshares file
            const operatorsData = [];
            operatorKeys.map((operator, index) => {
                operatorsData.push({
                    id: operatorIds[index],
                    publicKey: operator,
                });
            });
            const keySharesData = {
                version: 'v2',
                data: {
                    publicKey: threshold.validatorPublicKey,
                    operators: operatorsData,
                    shares: {
                        publicKeys: shares.map(share => share.publicKey),
                        encryptedKeys: shares.map(share => share.privateKey),
                    },
                },
                payload: {
                    explained: {
                        validatorPublicKey: payload[0],
                        operatorIds: payload[1],
                        sharePublicKeys: payload[2],
                        sharePrivateKey: payload[3],
                        ssvAmount: payload[4],
                    },
                    raw: payload.join(','),
                },
            };
            const keySharesFile = yield KeyShares_1.KeyShares.fromData(keySharesData);
            const keySharesFilePath = yield (0, helpers_1.getFilePath)('keyshares', outputFolder);
            yield (0, helpers_1.writeFile)(keySharesFilePath, keySharesFile.toString());
            return `\nKey distribution successful! Find your key shares file at ${safe_1.default.bgYellow(safe_1.default.black(keySharesFilePath))}\n`;
        });
    }
    /**
     * Encrypt shares and return all information that can be useful.
     * @param keystore
     * @param password
     * @param operatorIds
     * @param operatorPublicKeys
     * @param ssvAmount
     */
    encryptShares(keystore, password, operatorIds, operatorPublicKeys, ssvAmount) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Step 1: read keystore file
            const data = yield (0, helpers_1.readFile)(String(keystore).trim());
            // Step 2: decrypt private key using keystore file and password
            const ssvKeys = new SSVKeys_1.SSVKeys();
            const privateKey = yield ssvKeys.getPrivateKeyFromKeystoreData(data, password);
            // Step 3: Build shares from operator IDs and public keys
            const threshold = yield ssvKeys.createThreshold(privateKey, operatorIds);
            const shares = yield ssvKeys.encryptShares(operatorPublicKeys, threshold.shares);
            // Step 4: Build final web3 transaction payload
            const payload = yield ssvKeys.buildPayload(threshold.validatorPublicKey, operatorIds, shares, ssvAmount);
            return {
                privateKey,
                keystore,
                password,
                operatorIds,
                operatorPublicKeys,
                shares,
                threshold,
                payload,
            };
        });
    }
}
exports.KeySharesAction = KeySharesAction;
//# sourceMappingURL=KeySharesAction.js.map