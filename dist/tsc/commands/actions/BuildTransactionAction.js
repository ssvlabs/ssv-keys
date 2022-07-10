"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildTransactionAction = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const BuildSharesAction_1 = require("./BuildSharesAction");
const helpers_1 = require("../../lib/helpers");
const web3 = new web3_1.default();
class BuildTransactionAction extends BuildSharesAction_1.BuildSharesAction {
    static get options() {
        return {
            action: 'transaction',
            shortAction: 'tr',
            description: 'Generate shares for a list of operators from a validator keystore file and output registration transaction payload',
            arguments: [
                BuildTransactionAction.KEYSTORE_ARGUMENT,
                BuildTransactionAction.PASSWORD_ARGUMENT,
                BuildTransactionAction.OPERATORS_PUBLIC_KEYS_ARGUMENT,
                BuildTransactionAction.OPERATORS_IDS_ARGUMENT,
                BuildTransactionAction.SSV_AMOUNT_ARGUMENT,
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { privateKey, operatorsIds, shares, } = yield this.dispatch();
            const { ssv_amount: ssvAmount } = this.args;
            // Step 4: build payload using encrypted shares
            const payload = yield this.ssvKeys.buildPayload(privateKey, operatorsIds, shares, ssvAmount);
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
                `\n\t ssv amount             ➡️   ${payload[4]}\n` +
                '\n]\n';
            const payloadFilePath = yield (0, helpers_1.getFilePath)('payload');
            const message = '✳️  Transaction payload have the following structure encoded as ABI Params: \n' +
                '\n[\n' +
                '\n\tvalidatorPublicKey           ➡️   String\n' +
                '\n\toperators IDs                ➡️   array[<operator ID>,         ..., <operator ID>]\n' +
                '\n\tsharePublicKeys              ➡️   array[<share public key>,    ..., <share public key>]\n' +
                '\n\tshareEncrypted               ➡️   array[<share private key>,   ..., <share private key>]\n' +
                '\n\tssv amount                   ➡️   number in Wei\n' +
                '\n]\n\n' +
                '\n--------------------------------------------------------------------------------\n' +
                `\n✳️  Transaction explained payload data: \n${explainedPayload}\n` +
                '\n--------------------------------------------------------------------------------\n' +
                `\n✳️  regiserValidator() Transaction raw payload data: \n\n${payload}\n`;
            yield (0, helpers_1.writeFile)(payloadFilePath, message);
            return message + `\nTransaction details dumped to file: ${safe_1.default.bgYellow(safe_1.default.black(payloadFilePath))}\n`;
        });
    }
}
exports.BuildTransactionAction = BuildTransactionAction;
BuildTransactionAction.SSV_AMOUNT_ARGUMENT = {
    arg1: '-ssv',
    arg2: '--ssv-token-amount',
    options: {
        type: String,
        required: true,
        help: 'Token amount fee required for this transaction in Wei. ' +
            'Calculated as: totalFee := allOperatorsFee + networkYearlyFees + liquidationCollateral. '
    },
    interactive: {
        options: {
            type: 'text',
            validate: (tokenAmount) => {
                try {
                    web3.utils.toBN(tokenAmount).toString();
                    return true;
                }
                catch (e) {
                    return 'Token amount should be positive big number in Wei';
                }
            }
        }
    }
};
//# sourceMappingURL=BuildTransactionAction.js.map