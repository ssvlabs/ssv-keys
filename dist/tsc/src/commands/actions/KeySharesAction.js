"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAction = void 0;
const tslib_1 = require("tslib");
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const BaseAction_1 = require("./BaseAction");
const SSVKeys_1 = require("../../lib/SSVKeys");
const file_1 = require("./validators/file");
const keystore_1 = tslib_1.__importDefault(require("./arguments/keystore"));
const operator_ids_1 = tslib_1.__importDefault(require("./arguments/operator-ids"));
const password_1 = tslib_1.__importDefault(require("./arguments/password"));
const key_shares_version_1 = tslib_1.__importDefault(require("./arguments/key-shares-version"));
const output_folder_1 = tslib_1.__importDefault(require("./arguments/output-folder"));
const operator_public_keys_1 = tslib_1.__importDefault(require("./arguments/operator-public-keys"));
const file_helper_1 = require("../../lib/helpers/file.helper");
/**
 * Command to build keyshares from user input.
 */
class KeySharesAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'shares',
            description: 'Generate shares for a list of operators from a validator keystore file',
            arguments: [
                keystore_1.default,
                password_1.default,
                operator_ids_1.default,
                operator_public_keys_1.default,
                key_shares_version_1.default,
                output_folder_1.default,
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { keystore, password, output_folder: outputFolder, } = this.args;
            let { operator_ids: operatorIds, operator_keys: operatorKeys, } = this.args;
            // Prepare data
            operatorKeys = operatorKeys.split(',');
            operatorIds = operatorIds.split(',').map((o) => parseInt(o, 10));
            const isKeyStoreValid = keystore_1.default.interactive.options.validate(keystore);
            if (isKeyStoreValid !== true) {
                throw Error(String(isKeyStoreValid));
            }
            const isValidPassword = yield password_1.default.interactive.options.validate(password);
            if (isValidPassword !== true) {
                throw Error(String(isValidPassword));
            }
            const keystoreFilePath = (0, file_1.sanitizePath)(String(keystore).trim());
            const keystoreData = yield (0, file_helper_1.readFile)(keystoreFilePath);
            // Initialize SSVKeys SDK
            const keysVersion = this.args.key_shares_version
                ? `v${this.args.key_shares_version}`
                : SSVKeys_1.SSVKeys.VERSION.V3;
            const ssvKeys = new SSVKeys_1.SSVKeys(keysVersion);
            const privateKey = yield ssvKeys.getPrivateKeyFromKeystoreData(keystoreData, password);
            // Build shares from operator IDs and public keys
            const encryptedShares = yield ssvKeys.buildShares(privateKey, operatorIds, operatorKeys);
            // Now save to key shares file encrypted shares and validator public key
            const keyShares = yield ssvKeys.keyShares.fromJson({});
            yield keyShares.setData({
                operators: operatorKeys.map((operator, index) => ({
                    id: operatorIds[index],
                    publicKey: operator,
                })),
                publicKey: ssvKeys.publicKey,
                encryptedShares,
            });
            // Build payload and save it in key shares file
            yield ssvKeys.buildPayload({
                publicKey: ssvKeys.publicKey,
                operatorIds,
                encryptedShares,
            });
            const keySharesFilePath = yield (0, file_helper_1.getFilePath)('keyshares', outputFolder.trim());
            yield (0, file_helper_1.writeFile)(keySharesFilePath, ssvKeys.keyShares.toJson());
            return `\nKey distribution successful! Find your key shares file at ${safe_1.default.bgYellow(safe_1.default.black(keySharesFilePath))}\n`;
        });
    }
}
exports.KeySharesAction = KeySharesAction;
//# sourceMappingURL=KeySharesAction.js.map