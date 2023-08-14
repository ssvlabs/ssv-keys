"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAction = void 0;
const tslib_1 = require("tslib");
const BaseAction_1 = require("./BaseAction");
const SSVKeys_1 = require("../../lib/SSVKeys");
const KeyShares_1 = require("../../lib/KeyShares/KeyShares");
const file_1 = require("./validators/file");
const keystore_path_1 = tslib_1.__importDefault(require("./arguments/keystore-path"));
const owner_nonce_1 = tslib_1.__importDefault(require("./arguments/owner-nonce"));
const operator_ids_1 = tslib_1.__importDefault(require("./arguments/operator-ids"));
const owner_address_1 = tslib_1.__importDefault(require("./arguments/owner-address"));
const multi_shares_1 = tslib_1.__importDefault(require("./arguments/multi-shares"));
const password_1 = tslib_1.__importDefault(require("./arguments/password"));
const output_folder_1 = tslib_1.__importDefault(require("./arguments/output-folder"));
const operator_public_keys_1 = tslib_1.__importDefault(require("./arguments/operator-public-keys"));
const keystore_password_1 = require("./validators/keystore-password");
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
                keystore_path_1.default,
                multi_shares_1.default,
                password_1.default,
                operator_ids_1.default,
                operator_public_keys_1.default,
                output_folder_1.default,
                owner_address_1.default,
                owner_nonce_1.default,
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { keystore_path: keystore, password, output_folder: outputFolder, owner_address: ownerAddress, owner_nonce: ownerNonce, multi_shares: multiShares, } = this.args;
            let { operator_ids: operatorIds, operator_keys: operatorKeys, } = this.args;
            // Prepare data
            operatorKeys = operatorKeys.split(',');
            operatorIds = operatorIds.split(',').map((o) => parseInt(o, 10));
            // Now save to key shares file encrypted shares and validator public key
            const operators = operatorKeys.map((operatorKey, index) => ({
                id: operatorIds[index],
                operatorKey,
            }));
            const keystorePath = (0, file_1.sanitizePath)(String(keystore).trim());
            if (multiShares) {
                const { files } = yield (0, file_helper_1.getKeyStoreFiles)(keystorePath);
                // validate all files
                console.debug('Validating keystore files, do not terminate process!');
                const validatedFiles = [];
                let failedValidation = 0;
                for (const file of files) {
                    const isKeyStoreValid = yield keystore_path_1.default.interactive.options.validateSingle(file);
                    const isValidPassword = yield keystore_password_1.keystorePasswordValidator.validatePassword(password, file);
                    if (isKeyStoreValid === true && isValidPassword === true) {
                        validatedFiles.push(file);
                    }
                    else {
                        failedValidation++;
                    }
                    process.stdout.write(`\r${validatedFiles.length}/${files.length} keystore files successfully validated. ${failedValidation} failed validation`);
                }
                process.stdout.write('\n');
                const outputFiles = [];
                let nextNonce = ownerNonce;
                let processedFilesCount = 0;
                console.debug('Splitting keystore files to shares, do not terminate process!');
                for (const file of validatedFiles) {
                    const keySharesFilePath = yield this._processFile(file, password, outputFolder, operators, ownerAddress, nextNonce);
                    outputFiles.push(keySharesFilePath);
                    processedFilesCount++;
                    process.stdout.write(`\r${processedFilesCount}/${validatedFiles.length} keystore files successfully split into shares`);
                    nextNonce++;
                }
                process.stdout.write('\n');
                return outputFiles;
            }
            else {
                const isKeyStoreValid = yield keystore_path_1.default.interactive.options.validateSingle(keystorePath);
                if (isKeyStoreValid !== true) {
                    throw Error(String(isKeyStoreValid));
                }
                const isValidPassword = yield keystore_password_1.keystorePasswordValidator.validatePassword(password, keystorePath);
                if (isValidPassword !== true) {
                    throw Error(String(isValidPassword));
                }
                const keySharesFilePath = yield this._processFile(keystorePath, password, outputFolder, operators, ownerAddress, ownerNonce);
                return [keySharesFilePath];
            }
        });
    }
    _processFile(keystoreFilePath, password, outputFolder, operators, ownerAddress, ownerNonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keystoreData = yield (0, file_helper_1.readFile)(keystoreFilePath);
            // Initialize SSVKeys SDK
            const ssvKeys = new SSVKeys_1.SSVKeys();
            const { privateKey, publicKey } = yield ssvKeys.extractKeys(keystoreData, password);
            // Build shares from operator IDs and public keys
            const encryptedShares = yield ssvKeys.buildShares(privateKey, operators);
            const keyShares = new KeyShares_1.KeyShares();
            yield keyShares.update({
                ownerAddress,
                ownerNonce,
                operators,
                publicKey,
            });
            // Build payload and save it in key shares file
            yield keyShares.buildPayload({
                publicKey,
                operators,
                encryptedShares,
            }, {
                ownerAddress,
                ownerNonce,
                privateKey,
            });
            const keySharesFilePath = yield (0, file_helper_1.getFilePath)('keyshares-files', outputFolder.trim());
            yield (0, file_helper_1.writeFile)(keySharesFilePath, keyShares.toJson());
            return keySharesFilePath;
        });
    }
}
exports.KeySharesAction = KeySharesAction;
//# sourceMappingURL=KeySharesAction.js.map