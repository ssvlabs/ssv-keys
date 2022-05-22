"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTransactionV2Action = void 0;
const tslib_1 = require("tslib");
const SSVKeysV2_1 = require("../../lib/SSVKeysV2");
const helpers_1 = require("../../lib/helpers");
const BaseAction_1 = require("./BaseAction");
class BuildTransactionV2Action extends BaseAction_1.BaseAction {
    constructor() {
        super(...arguments);
        this.ssvKeys = new SSVKeysV2_1.SSVKeysV2();
    }
    static get options() {
        return {
            action: 'transaction_v2',
            shortAction: 'tr_v2',
            arguments: [
                {
                    arg1: '-sh',
                    arg2: '--shares',
                    options: {
                        help: 'File path to shares JSON dumped before. '
                    }
                },
                {
                    arg1: '-pk',
                    arg2: '--private-key',
                    options: {
                        type: String,
                        required: true,
                        help: 'Private key which you get using keystore and password'
                    }
                },
                {
                    arg1: '-oid',
                    arg2: '--operators-ids',
                    options: {
                        type: String,
                        required: true,
                        help: 'Comma-separated list of operators IDs from the contract'
                    }
                },
                {
                    arg1: '-tag',
                    arg2: '--token-amount-gwei',
                    options: {
                        type: String,
                        required: true,
                        help: 'Token amount fee required for this transaction in Gwei. ' +
                            'Calculated as: totalFee := allOperatorsFee + networkYearlyFees + liquidationCollateral. '
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
            const { shares, private_key: privateKey, operators_ids: operatorsIds, token_amount_gwei: tokenAmount } = this.args;
            const encryptedShares = yield (0, helpers_1.readFile)(shares, true);
            const payload = yield this.ssvKeys.buildPayloadV2(privateKey, operatorsIds.split(','), encryptedShares, tokenAmount);
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
                '\n\ttoken amount                 ➡️   number in Gwei\n' +
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
exports.BuildTransactionV2Action = BuildTransactionV2Action;
//# sourceMappingURL=BuildTransactionV2Action.js.map