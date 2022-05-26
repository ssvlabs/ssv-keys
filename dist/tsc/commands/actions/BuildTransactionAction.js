"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTransactionAction = void 0;
const tslib_1 = require("tslib");
const BaseAction_1 = require("./BaseAction");
const helpers_1 = require("../../lib/helpers");
class BuildTransactionAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'transaction',
            shortAction: 'tr',
            arguments: [
                {
                    arg1: '-sh',
                    arg2: '--shares',
                    options: {
                        required: true,
                        help: 'File path to shares JSON dumped before'
                    }
                },
                {
                    arg1: '-pk',
                    arg2: '--private-key',
                    options: {
                        type: String,
                        required: true,
                        help: 'Private key which you get using keystore and password'
                    },
                    interactive: {
                        options: {
                            type: 'password',
                        }
                    }
                },
                {
                    arg1: '-oid',
                    arg2: '--operators-ids',
                    options: {
                        type: String,
                        required: true,
                        help: 'Comma-separated list of operators IDs from the contract'
                    },
                    interactive: {
                        repeat: 4,
                        options: {
                            type: 'number',
                            message: 'Operator ID from the contract',
                            validate: (operatorId) => {
                                return !(Number.isInteger(operatorId) && operatorId > 0) ? 'Operator ID should be integer number' : true;
                            }
                        }
                    }
                },
                {
                    arg1: '-tag',
                    arg2: '--token-amount',
                    options: {
                        type: String,
                        required: true,
                        help: 'Token amount fee required for this transaction in Wei. ' +
                            'Calculated as: totalFee := allOperatorsFee + networkYearlyFees + liquidationCollateral. '
                    },
                    interactive: {
                        options: {
                            type: 'number',
                            validate: (tokenAmount) => {
                                return !(Number.isInteger(tokenAmount) && tokenAmount > 0) ? 'Token amount should be integer number' : true;
                            }
                        }
                    }
                },
                {
                    arg1: '-o',
                    arg2: '--output',
                    options: {
                        type: String,
                        help: 'Write explained result into text file if necessary'
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
            const { shares, private_key: privateKey, operators_ids: operatorsIds, token_amount: tokenAmount } = this.args;
            const encryptedShares = yield (0, helpers_1.readFile)(shares, true);
            const payload = yield this.ssvKeys.buildPayload(privateKey, operatorsIds.split(','), encryptedShares, tokenAmount);
            const explainedPayload = '' +
                '\n[\n' +
                `\n\t validator public key   ➡️   ${payload[0]}\n` +
                `\n\t operators IDs          ➡️   array${payload[1]}\n` +
                '\n\t share public keys      ➡️   array[\n' +
                payload[2].map((publicKey, index) => `\n\t                                   [${index}]: ${publicKey}\n`).join('') +
                '                                 ]\n' +
                '\n\t share private keys     ➡️   array[\n' +
                payload[3].map((privateKey, index) => `\n\t                                   [${index}]: ${privateKey}\n`).join('') +
                '                                 ]\n' +
                `\n\t token amount           ➡️   ${payload[4]}\n` +
                '\n]\n';
            const message = '✳️  Transaction payload have the following structure encoded as ABI Params: \n' +
                '\n[\n' +
                '\n\tthreshold.validatorPublicKey ➡️   String\n' +
                '\n\toperators IDs                ➡️   array[<operator ID>,         ..., <operator ID>]\n' +
                '\n\tsharePublicKeys              ➡️   array[<share public key>,    ..., <share public key>]\n' +
                '\n\tsharePrivateKeys             ➡️   array[<share private key>,   ..., <share private key>]\n' +
                '\n\ttoken amount                 ➡️   number in Wei\n' +
                '\n]\n\n' +
                '\n--------------------------------------------------------------------------------\n' +
                `\n✳️  Transaction explained payload data: \n${explainedPayload}\n` +
                '\n--------------------------------------------------------------------------------\n' +
                `\n✳️  Transaction raw payload data: \n\n${payload}`;
            if (this.args.output) {
                yield (0, helpers_1.writeFile)(this.args.output, message);
            }
            return message;
        });
    }
}
exports.BuildTransactionAction = BuildTransactionAction;
//# sourceMappingURL=BuildTransactionAction.js.map