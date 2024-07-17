"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesAction = void 0;
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const BaseAction_1 = require("./BaseAction");
const SSVKeys_1 = require("../../lib/SSVKeys");
const KeySharesItem_1 = require("../../lib/KeyShares/KeySharesItem");
const KeyShares_1 = require("../../lib/KeyShares/KeyShares");
const base_1 = require("../../lib/exceptions/base");
const validators_1 = require("./validators");
const arguments_1 = require("./arguments");
const file_helper_1 = require("../../lib/helpers/file.helper");
const operator_1 = require("../../lib/exceptions/operator");
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
                arguments_1.keystorePasswordArgument,
                arguments_1.operatorIdsArgument,
                arguments_1.operatorPublicKeysArgument,
                arguments_1.outputFolderArgument,
                arguments_1.ownerAddressArgument,
                arguments_1.ownerNonceArgument,
            ],
        };
    }
    async execute() {
        this.validateKeystoreArguments(); // Validate keystore arguments
        const keySharesList = await this.processKeystorePath();
        const keySharesFilePath = await this.saveKeyShares(keySharesList, this.args.output_folder);
        return keySharesFilePath;
    }
    validateKeystoreArguments() {
        const hasKeystore = !!this.args.keystore;
        if (!hasKeystore) {
            throw new base_1.SSVKeysException('Please provide a path to the validator keystore file or to the folder containing multiple validator keystore files.');
        }
    }
    async processKeystorePath() {
        const keystorePath = (0, validators_1.sanitizePath)(String(this.args.keystore).trim());
        const { files } = await (0, file_helper_1.getKeyStoreFiles)(keystorePath);
        const validatedFiles = await this.validateKeystoreFiles(files);
        const singleKeySharesList = await Promise.all(validatedFiles.map((file, index) => this.processFile(file, this.args.password, this.getOperators(), this.args.owner_address, this.args.owner_nonce + index)));
        return singleKeySharesList;
    }
    async validateKeystoreFiles(files) {
        const validatedFiles = [];
        let failedValidation = 0;
        for (const [index, file] of files.entries()) {
            const isKeyStoreValid = await arguments_1.keystoreArgument.interactive.options.validate(file);
            const isValidPassword = await validators_1.keystorePasswordValidator.validatePassword(this.args.password, file);
            let status = '✅';
            if (isKeyStoreValid === true && isValidPassword === true) {
                validatedFiles.push(file);
            }
            else {
                failedValidation++;
                status = '❌';
            }
            const fileName = path_1.default.basename(file); // Extract the file name
            process.stdout.write(`\r\n${index + 1}/${files.length} ${status} ${fileName}`);
        }
        process.stdout.write(`\n\n${files.length - failedValidation} of ${files.length} keystore files successfully validated. ${failedValidation} failed validation`);
        process.stdout.write('\n');
        return validatedFiles;
    }
    getOperators() {
        const operatorIds = this.args.operator_ids.split(',');
        const operatorKeys = this.args.operator_keys.split(',');
        if (operatorIds.length !== operatorKeys.length) {
            throw new operator_1.OperatorsCountsMismatchError(operatorIds, operatorKeys, 'Mismatch amount of operator ids and operator keys.');
        }
        if (operatorIds.includes('') || operatorKeys.includes('')) {
            throw new base_1.SSVKeysException('Operator IDs or keys cannot contain empty strings.');
        }
        return operatorIds.map((idString, index) => {
            const id = parseInt(idString, 10);
            if (isNaN(id)) {
                throw new base_1.SSVKeysException(`Invalid operator ID at position ${index}: ${idString}`);
            }
            const operatorKey = operatorKeys[index];
            return { id, operatorKey };
        });
    }
    async processFile(keystoreFilePath, password, operators, ownerAddress, ownerNonce) {
        const keystoreData = await (0, file_helper_1.readFile)(keystoreFilePath);
        const ssvKeys = new SSVKeys_1.SSVKeys();
        const { privateKey, publicKey } = await ssvKeys.extractKeys(keystoreData, password);
        const encryptedShares = await ssvKeys.buildShares(privateKey, operators);
        const keySharesItem = new KeySharesItem_1.KeySharesItem();
        await keySharesItem.update({ ownerAddress, ownerNonce, operators, publicKey });
        await keySharesItem.buildPayload({ publicKey, operators, encryptedShares }, { ownerAddress, ownerNonce, privateKey });
        return keySharesItem;
    }
    async saveKeyShares(keySharesItems, outputFolder) {
        if (keySharesItems.length === 0) {
            throw new base_1.SSVKeysException('Unable to locate valid keystore files. Please verify that the keystore files are valid and the password is correct.');
        }
        process.stdout.write(`\n\nGenerating Keyshares file, this might take a few minutes do not close terminal.`);
        const keyShares = new KeyShares_1.KeyShares();
        keySharesItems.forEach(keySharesItem => keyShares.add(keySharesItem));
        const keySharesFilePath = await (0, file_helper_1.getFilePath)('keyshares', outputFolder.trim());
        await (0, file_helper_1.writeFile)(keySharesFilePath, keyShares.toJson());
        return keySharesFilePath;
    }
}
exports.KeySharesAction = KeySharesAction;
//# sourceMappingURL=KeySharesAction.js.map