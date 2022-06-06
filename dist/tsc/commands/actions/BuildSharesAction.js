"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSharesAction = void 0;
const tslib_1 = require("tslib");
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const js_base64_1 = require("js-base64");
const BaseAction_1 = require("./BaseAction");
const file_1 = require("./validators/file");
const operator_1 = require("./validators/operator");
const helpers_1 = require("../../lib/helpers");
const keystore_password_1 = require("./validators/keystore-password");
const keystorePasswordValidator = new keystore_password_1.KeystorePasswordValidator();
class BuildSharesAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'shares',
            shortAction: 'sh',
            description: 'Build shares for list of operators using private key from keystore',
            arguments: [
                {
                    arg1: '-ks',
                    arg2: '--keystore',
                    options: {
                        required: true,
                        type: String,
                        help: 'Keystore file path'
                    },
                    interactive: {
                        options: {
                            type: 'text',
                            validate: (filePath) => {
                                const isValid = (0, file_1.fileExistsValidator)(filePath);
                                if (isValid === true) {
                                    keystorePasswordValidator.setKeystoreFilePath(String(filePath).trim());
                                }
                                return isValid;
                            },
                        }
                    }
                },
                {
                    arg1: '-ps',
                    arg2: '--password',
                    options: {
                        required: true,
                        type: String,
                        help: 'Password for keystore to decrypt it and get private key'
                    },
                    interactive: {
                        options: {
                            type: 'password',
                            validate: (password) => {
                                return keystorePasswordValidator.validatePassword(password);
                            },
                        }
                    }
                },
                {
                    arg1: '-op',
                    arg2: '--operators',
                    options: {
                        type: String,
                        required: true,
                        help: 'Comma-separated list of base64 operator keys. ' +
                            'Require at least 4 operators'
                    },
                    interactive: {
                        repeat: 4,
                        options: {
                            type: 'text',
                            message: 'Operator base64 encoded public key',
                            validate: operator_1.operatorValidator
                        }
                    }
                },
                {
                    arg1: '-of',
                    arg2: '--output-format',
                    options: {
                        type: String,
                        required: true,
                        default: 'abi',
                        help: 'Format of result: "abi" or "raw". By default: "abi"'
                    },
                    interactive: {
                        options: {
                            type: 'select',
                            message: 'Select format to print shares in',
                            choices: [
                                { title: 'Encoded ABI', description: 'Result will be encoded in ABI format', value: 'abi' },
                                { title: 'Raw data', description: 'Result will be printed in a raw format', value: 'raw' },
                            ],
                            initial: 0
                        }
                    }
                }
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Step 1: read keystore file
            const { keystore, password, output_format: outputFormat } = this.args;
            const data = yield (0, helpers_1.readFile)(String(keystore).trim());
            // Step 2: decrypt private key using keystore file and password
            const privateKey = yield this.ssvKeys.getPrivateKeyFromKeystoreData(data, password);
            // Step 3: Build shares for provided operators list
            const threshold = yield this.ssvKeys.createThreshold(privateKey);
            let shares = yield this.ssvKeys.encryptShares(this.args.operators.split(','), threshold.shares);
            shares = shares.map((share) => {
                share.operatorPublicKey = (0, js_base64_1.encode)(share.operatorPublicKey);
                if (outputFormat === 'abi') {
                    share.operatorPublicKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.operatorPublicKey);
                    share.privateKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.privateKey);
                }
                return share;
            });
            // Print out result and dump shares into file
            const sharesJson = JSON.stringify(shares, null, '  ');
            let sharesMessage = `Shares: \n${sharesJson}`;
            const sharesFilePath = yield (0, helpers_1.getFilePath)('shares');
            yield (0, helpers_1.writeFile)(sharesFilePath, sharesJson);
            sharesMessage = `${sharesMessage}\n\nShares dumped to file: ${safe_1.default.bgYellow(safe_1.default.black(sharesFilePath))}`;
            return `${sharesMessage}`;
        });
    }
}
exports.BuildSharesAction = BuildSharesAction;
//# sourceMappingURL=BuildSharesAction.js.map