"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAction = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const BaseAction_1 = require("./BaseAction");
const SSVKeys_1 = require("../../lib/SSVKeys");
const KeySharesItem_1 = require("../../lib/KeyShares/KeySharesItem");
const KeyShares_1 = require("../../lib/KeyShares/KeyShares");
const validators_1 = require("./validators");
const arguments_1 = require("./arguments");
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
                arguments_1.keystoreArgument,
                arguments_1.keystorePathArgument,
                arguments_1.keystorePasswordArgument,
                arguments_1.operatorIdsArgument,
                arguments_1.operatorPublicKeysArgument,
                arguments_1.outputFolderArgument,
                arguments_1.ownerAddressArgument,
                arguments_1.ownerNonceArgument,
            ],
        };
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.validateKeystoreArguments(); // Validate keystore arguments
            const keySharesList = yield this.getKeySharesList();
            const keySharesFilePath = yield this.saveKeyShares(keySharesList, this.args.output_folder);
            return keySharesFilePath;
        });
    }
    getKeySharesList() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.args.keystore) {
                return [yield this.processKeystore()];
            }
            else if (this.args.keystore_path) {
                return yield this.processKeystorePath();
            }
            throw new Error('Either --keystore or --keystore-path must be provided.');
        });
    }
    validateKeystoreArguments() {
        const hasKeystore = !!this.args.keystore;
        const hasKeystorePath = !!this.args.keystore_path;
        if (hasKeystore && hasKeystorePath) {
            throw new Error('Only one of --keystore or --keystore-path should be provided.');
        }
        if (hasKeystorePath && !this.isDirectory(this.args.keystore_path)) {
            throw new Error('--keystore-path must be a directory.');
        }
    }
    isDirectory(path) {
        try {
            const stats = fs_1.default.statSync(path);
            return stats.isDirectory();
        }
        catch (error) {
            // Handle errors (like path does not exist)
            console.error(`Error checking if path is a directory: ${error.message}`);
            return false;
        }
    }
    processKeystorePath() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keystorePath = (0, validators_1.sanitizePath)(String(this.args.keystore_path).trim());
            const { files } = yield (0, file_helper_1.getKeyStoreFiles)(keystorePath);
            const validatedFiles = yield this.validateKeystoreFiles(files);
            const singleKeySharesList = yield Promise.all(validatedFiles.map((file, index) => this.processFile(file, this.args.password, this.getOperators(), this.args.owner_address, this.args.owner_nonce + index)));
            return singleKeySharesList;
        });
    }
    processKeystore() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keystore = this.args.keystore;
            yield this.validateSingleKeystore(keystore);
            const singleKeyShares = yield this.processFile(keystore, this.args.password, this.getOperators(), this.args.owner_address, this.args.owner_nonce);
            return singleKeyShares;
        });
    }
    validateKeystoreFiles(files) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const validatedFiles = [];
            let failedValidation = 0;
            for (const file of files) {
                const isKeyStoreValid = yield arguments_1.keystoreArgument.interactive.options.validateSingle(file);
                const isValidPassword = yield validators_1.keystorePasswordValidator.validatePassword(this.args.password, file);
                if (isKeyStoreValid === true && isValidPassword === true) {
                    validatedFiles.push(file);
                }
                else {
                    failedValidation++;
                }
                process.stdout.write(`\r${validatedFiles.length}/${files.length} keystore files successfully validated. ${failedValidation} failed validation`);
            }
            process.stdout.write('\n');
            return validatedFiles;
        });
    }
    validateSingleKeystore(keystore) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const isKeyStoreValid = yield arguments_1.keystoreArgument.interactive.options.validateSingle(keystore);
            if (isKeyStoreValid !== true) {
                throw Error(String(isKeyStoreValid));
            }
        });
    }
    getOperators() {
        return this.args.operator_keys.split(',').map((operatorKey, index) => ({
            id: parseInt(this.args.operator_ids.split(',')[index], 10),
            operatorKey,
        }));
    }
    processFile(keystoreFilePath, password, operators, ownerAddress, ownerNonce) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keystoreData = yield (0, file_helper_1.readFile)(keystoreFilePath);
            const ssvKeys = new SSVKeys_1.SSVKeys();
            const { privateKey, publicKey } = yield ssvKeys.extractKeys(keystoreData, password);
            const encryptedShares = yield ssvKeys.buildShares(privateKey, operators);
            const keySharesItem = new KeySharesItem_1.KeySharesItem();
            yield keySharesItem.update({ ownerAddress, ownerNonce, operators, publicKey });
            yield keySharesItem.buildPayload({ publicKey, operators, encryptedShares }, { ownerAddress, ownerNonce, privateKey });
            return keySharesItem;
        });
    }
    saveKeyShares(keySharesItems, outputFolder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const keyShares = new KeyShares_1.KeyShares();
            keySharesItems.forEach(keySharesItem => keyShares.add(keySharesItem));
            const keySharesFilePath = yield (0, file_helper_1.getFilePath)('keyshares', outputFolder.trim());
            yield (0, file_helper_1.writeFile)(keySharesFilePath, keyShares.toJson());
            return keySharesFilePath;
        });
    }
}
exports.KeySharesAction = KeySharesAction;
//# sourceMappingURL=KeySharesAction.js.map