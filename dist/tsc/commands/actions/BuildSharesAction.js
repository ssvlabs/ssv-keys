"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSharesAction = void 0;
const tslib_1 = require("tslib");
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const js_base64_1 = require("js-base64");
const BaseAction_1 = require("./BaseAction");
const operator_1 = require("./validators/operator");
const helpers_1 = require("../../lib/helpers");
const file_1 = require("./validators/file");
const keystore_password_1 = require("./validators/keystore-password");
const keystorePasswordValidator = new keystore_password_1.KeystorePasswordValidator();
class BuildSharesAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'shares',
            shortAction: 'sh',
            description: 'Generate shares for a list of operators from a validator keystore file',
            arguments: [
                BuildSharesAction.KEYSTORE_ARGUMENT,
                BuildSharesAction.PASSWORD_ARGUMENT,
                BuildSharesAction.OPERATORS_PUBLIC_KEYS_ARGUMENT,
                BuildSharesAction.OPERATORS_IDS_ARGUMENT,
                BuildSharesAction.OUTPUT_FORMAT_ARGUMENT,
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { shares } = yield this.dispatch();
            // Print out result and dump shares into file
            const sharesJson = JSON.stringify(shares, null, '  ');
            let sharesMessage = `Shares: \n${sharesJson}`;
            const sharesFilePath = yield (0, helpers_1.getFilePath)('shares');
            yield (0, helpers_1.writeFile)(sharesFilePath, sharesJson);
            sharesMessage = `${sharesMessage}\n\nShares dumped to file: ${safe_1.default.bgYellow(safe_1.default.black(sharesFilePath))}`;
            return `${sharesMessage}`;
        });
    }
    dispatch() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { keystore, password, output_format: outputFormat, } = this.args;
            let { operators_ids: operatorsIds, operators } = this.args;
            operators = operators.split(',');
            operatorsIds = operatorsIds.split(',').map((o) => parseInt(o, 10));
            // Step 1: read keystore file
            const data = yield (0, helpers_1.readFile)(String(keystore).trim());
            // Step 2: decrypt private key using keystore file and password
            const privateKey = yield this.ssvKeys.getPrivateKeyFromKeystoreData(data, password);
            // Step 3: Build shares for provided operators list
            const threshold = yield this.ssvKeys.createThreshold(privateKey, operatorsIds);
            let shares = yield this.ssvKeys.encryptShares(operators, threshold.shares);
            shares = shares.map((share) => {
                share.operatorPublicKey = (0, js_base64_1.encode)(share.operatorPublicKey);
                if (outputFormat === 'abi') {
                    share.operatorPublicKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.operatorPublicKey);
                    share.privateKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.privateKey);
                }
                return share;
            });
            return {
                privateKey,
                keystore,
                password,
                operatorsIds,
                operators,
                shares,
                threshold,
            };
        });
    }
}
exports.BuildSharesAction = BuildSharesAction;
BuildSharesAction.KEYSTORE_ARGUMENT = {
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
                filePath = String(filePath).trim();
                let isValid = (0, file_1.fileExistsValidator)(filePath);
                if (isValid !== true) {
                    return isValid;
                }
                isValid = (0, file_1.jsonFileValidator)(filePath);
                if (isValid !== true) {
                    return isValid;
                }
                keystorePasswordValidator.setKeystoreFilePath(String(filePath).trim());
                return true;
            },
        }
    }
};
BuildSharesAction.PASSWORD_ARGUMENT = {
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
};
BuildSharesAction.OPERATORS_PUBLIC_KEYS_ARGUMENT = {
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
        repeatWith: [
            '--operators-ids'
        ],
        options: {
            type: 'text',
            message: 'Operator base64 encoded public key',
            validate: operator_1.operatorValidator
        }
    }
};
BuildSharesAction.OPERATORS_IDS_ARGUMENT = {
    arg1: '-oid',
    arg2: '--operators-ids',
    options: {
        type: String,
        required: true,
        help: 'Comma-separated list of operators IDs from the contract in the same sequence as you provided operators itself'
    },
    interactive: {
        repeat: 4,
        options: {
            type: 'number',
            message: 'Operator ID from the contract',
            validate: (operatorId) => {
                return !(Number.isInteger(operatorId) && operatorId > 0) ? 'Operator ID should be positive integer number' : true;
            }
        }
    }
};
BuildSharesAction.OUTPUT_FORMAT_ARGUMENT = {
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
};
//# sourceMappingURL=BuildSharesAction.js.map