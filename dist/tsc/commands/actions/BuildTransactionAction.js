"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTransactionAction = void 0;
const tslib_1 = require("tslib");
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const js_base64_1 = require("js-base64");
const BaseAction_1 = require("./BaseAction");
const file_1 = require("./validators/file");
const operator_1 = require("./validators/operator");
const helpers_1 = require("../../lib/helpers");
class BuildTransactionAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'transaction',
            shortAction: 'tr',
            description: 'Build shares for list of operators using private key from keystore. Then build final transaction using those shares.',
            arguments: [
                {
                    arg1: '-ks',
                    arg2: '--keystore',
                    options: {
                        required: true,
                        type: String,
                        help: 'Provide your keystore file path'
                    },
                    interactive: {
                        options: {
                            type: 'text',
                            validate: file_1.fileExistsValidator,
                        }
                    }
                },
                {
                    arg1: '-ps',
                    arg2: '--password',
                    options: {
                        required: true,
                        type: String,
                        help: 'Enter password for keystore to decrypt it and get private key'
                    },
                    interactive: {
                        options: {
                            type: 'password',
                        }
                    }
                },
                {
                    arg1: '-op',
                    arg2: '--operators',
                    options: {
                        type: String,
                        required: true,
                        help: 'Comma-separated list of base64 operator keys. Require at least 4 operators'
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
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { keystore, password } = this.args;
            // Step 1: read keystore file
            const data = yield (0, helpers_1.readFile)(String(keystore).trim());
            // Step 2: decrypt keystore file and get private key
            const privateKey = yield this.ssvKeys.getPrivateKeyFromKeystoreData(data, password);
            // Step 3: build shares in raw format
            const threshold = yield this.ssvKeys.createThreshold(privateKey);
            let shares = yield this.ssvKeys.encryptShares(this.args.operators.split(','), threshold.shares);
            shares = shares.map((share) => {
                share.operatorPublicKey = (0, js_base64_1.encode)(share.operatorPublicKey);
                return share;
            });
            // Step 4: build payload using encrypted shares
            const payload = yield this.ssvKeys.buildPayload(privateKey, shares);
            const explainedPayload = '' +
                '\n[\n' +
                `\n\t validator public key   ➡️   ${payload[0]}\n` +
                '\n\t operators public keys  ➡️   array[\n' +
                payload[1].map((publicKey, index) => `\n\t                                   [${index}]: ${publicKey}\n`).join('') +
                '                                 ]\n' +
                '\n\t share public keys      ➡️   array[\n' +
                payload[2].map((publicKey, index) => `\n\t                                   [${index}]: ${publicKey}\n`).join('') +
                '                                 ]\n' +
                '\n\t share private keys     ➡️   array[\n' +
                payload[3].map((privateKey, index) => `\n\t                                   [${index}]: ${privateKey}\n`).join('') +
                '                                 ]\n' +
                '\n]\n';
            const payloadFilePath = yield (0, helpers_1.getFilePath)('payload');
            const message = '✳️  Transaction payload have the following structure encoded as ABI Params: \n' +
                '\n[\n' +
                '\n\tthreshold.validatorPublicKey ➡️   String\n' +
                '\n\toperatorsPublicKeys          ➡️   array[<operator public key>, ..., <operator public key>]\n' +
                '\n\tsharePublicKeys              ➡️   array[<share public key>,    ..., <share public key>]\n' +
                '\n\tsharePrivateKeys             ➡️   array[<share private key>,   ..., <share private key>]\n' +
                '\n]\n\n' +
                '\n--------------------------------------------------------------------------------\n' +
                `\n✳️  Transaction explained payload data: \n${explainedPayload}\n` +
                '\n--------------------------------------------------------------------------------\n' +
                `\n✳️  Transaction raw payload data: \n\n${payload}\n`;
            yield (0, helpers_1.writeFile)(payloadFilePath, message);
            return message + `\nTransaction details dumped to file: ${safe_1.default.bgYellow(safe_1.default.black(payloadFilePath))}\n`;
        });
    }
}
exports.BuildTransactionAction = BuildTransactionAction;
//# sourceMappingURL=BuildTransactionAction.js.map