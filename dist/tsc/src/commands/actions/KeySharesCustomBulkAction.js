"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesCustomBulkAction = void 0;
const tslib_1 = require("tslib");
const BaseAction_1 = require("./BaseAction");
const SSVKeys_1 = require("../../lib/SSVKeys");
const KeyShares_1 = require("../../lib/KeyShares/KeyShares");
const file_1 = require("./validators/file");
const keystore_path_1 = tslib_1.__importDefault(require("./arguments/keystore-path"));
const owner_nonce_1 = tslib_1.__importDefault(require("./arguments/owner-nonce"));
const owner_address_1 = tslib_1.__importDefault(require("./arguments/owner-address"));
const multi_shares_1 = tslib_1.__importDefault(require("./arguments/multi-shares"));
const password_1 = tslib_1.__importDefault(require("./arguments/password"));
const output_folder_1 = tslib_1.__importDefault(require("./arguments/output-folder"));
const operators_1 = tslib_1.__importDefault(require("./arguments/custom-bulk/operators"));
const operators_distribution_1 = tslib_1.__importDefault(require("./arguments/custom-bulk/operators-distribution"));
const keystore_password_1 = require("./validators/keystore-password");
const file_helper_1 = require("../../lib/helpers/file.helper");
/**
 * Command to build keyshares from user input.
 */
class KeySharesCustomBulkAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'custom-bulk',
            description: 'Generate shares for a operators and distribution per cluster csv files',
            arguments: [
                keystore_path_1.default,
                multi_shares_1.default,
                password_1.default,
                output_folder_1.default,
                owner_address_1.default,
                owner_nonce_1.default,
                operators_1.default,
                operators_distribution_1.default,
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { keystore_path: keystorePath, operators: operatorsFile, operators_distribution: operatorsDistributionFile, password, output_folder: outputFolder, owner_address: ownerAddress, owner_nonce: ownerNonce, multi_shares: multiShares, } = this.args;
            // Now save to key shares file encrypted shares and validator public key
            /*
            const operators = operatorKeys.map((operatorKey: string, index: number) => ({
              id: operatorIds[index],
              operatorKey,
            }));
            */
            const operators = (0, file_helper_1.readOperatorsFile)((0, file_1.sanitizePath)(operatorsFile));
            const operatorsDistribution = (0, file_helper_1.readOperatorsDistributionFile)((0, file_1.sanitizePath)(operatorsDistributionFile));
            const operatorGroups = operatorsDistribution.map((operatorRow) => operatorRow.map((id) => ({
                id: id,
                operatorKey: operators.get(id) || 'unknown',
            })));
            let outputFiles = [];
            const bulkProcess = multiShares || true;
            if (bulkProcess) {
                const { files } = yield (0, file_helper_1.getKeyStoreFiles)((0, file_1.sanitizePath)(keystorePath));
                // validate all files
                console.debug('Validating keystore files, do not terminate process!');
                let validatedFilesCount = 0;
                for (const file of files) {
                    const isKeyStoreValid = yield keystore_path_1.default.validateSingle(file);
                    if (isKeyStoreValid !== true) {
                        throw Error(String(isKeyStoreValid));
                    }
                    const isValidPassword = yield keystore_password_1.keystorePasswordValidator.validatePassword(password, file);
                    if (isValidPassword !== true) {
                        throw Error(String(isValidPassword));
                    }
                    validatedFilesCount++;
                    process.stdout.write(`\r${validatedFilesCount}/${files.length} keystore files successfully validated`);
                }
                process.stdout.write('\n');
                this.ownerNonce = ownerNonce;
                let processedFilesCount = 0;
                console.debug('Splitting keystore files to shares, do not terminate process!');
                for (const file of files) {
                    const keySharesFiles = yield this._processFile(file, password, outputFolder, operatorGroups, ownerAddress);
                    outputFiles = [...outputFiles, ...keySharesFiles];
                    processedFilesCount++;
                    process.stdout.write(`\r${processedFilesCount}/${files.length} keystore files successfully split into shares`);
                }
            }
            else {
                const isKeyStoreValid = yield keystore_path_1.default.validateSingle(keystorePath);
                if (isKeyStoreValid !== true) {
                    throw Error(String(isKeyStoreValid));
                }
                const isValidPassword = yield keystore_password_1.keystorePasswordValidator.validatePassword(password, keystorePath);
                if (isValidPassword !== true) {
                    throw Error(String(isValidPassword));
                }
                const keySharesFiles = yield this._processFile(keystorePath, password, outputFolder, operatorGroups, ownerAddress);
                outputFiles = [...keySharesFiles];
            }
            return outputFiles;
        });
    }
    _processFile(keystoreFilePath, password, outputFolder, operatorGroups, ownerAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keystoreData = yield (0, file_helper_1.readFile)(keystoreFilePath);
            // Initialize SSVKeys SDK
            const ssvKeys = new SSVKeys_1.SSVKeys();
            const { privateKey, publicKey } = yield ssvKeys.extractKeys(keystoreData, password);
            const keySharesFiles = [];
            for (const [index, operators] of operatorGroups.entries()) {
                // Build shares from operator IDs and public keys
                const encryptedShares = yield ssvKeys.buildShares(privateKey, operators);
                const keyShares = new KeyShares_1.KeyShares();
                yield keyShares.update({
                    ownerAddress,
                    ownerNonce: this.ownerNonce,
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
                    ownerNonce: this.ownerNonce,
                    privateKey,
                });
                const keySharesFilePath = yield (0, file_helper_1.getFilePath)('keyshares-files', outputFolder.trim(), `${index}`);
                yield (0, file_helper_1.writeFile)(keySharesFilePath, keyShares.toJson());
                keySharesFiles.push(keySharesFilePath);
                this.ownerNonce++;
            }
            return keySharesFiles;
        });
    }
}
exports.KeySharesCustomBulkAction = KeySharesCustomBulkAction;
//# sourceMappingURL=KeySharesCustomBulkAction.js.map