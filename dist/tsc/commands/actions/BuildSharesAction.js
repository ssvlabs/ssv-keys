"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSharesAction = void 0;
const tslib_1 = require("tslib");
const js_base64_1 = require("js-base64");
const BaseAction_1 = require("./BaseAction");
const helpers_1 = require("../../lib/helpers");
class BuildSharesAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'shares',
            shortAction: 'sh',
            arguments: [
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
                            /**
                             * Basic (not deep) validation of RSA key
                             * @param operator
                             */
                            validate: (operator) => {
                                try {
                                    const decodedOperator = (0, js_base64_1.decode)(operator);
                                    if (!decodedOperator.startsWith('-----BEGIN RSA PUBLIC KEY-----')) {
                                        throw Error('Not valid RSA key');
                                    }
                                    return true;
                                }
                                catch (e) {
                                    return 'Only valid base64 string is allowed';
                                }
                            }
                        }
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
                    arg1: '-o',
                    arg2: '--output',
                    options: {
                        type: String,
                        help: 'Write result as JSON to specified file'
                    },
                    interactive: {
                        options: {
                            type: 'text',
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
            const { private_key: privateKey } = this.args;
            const threshold = yield this.ssvKeys.createThreshold(privateKey);
            const shares = yield this.ssvKeys.encryptShares(this.args.operators.split(','), threshold.shares);
            const sharesJson = JSON.stringify(shares, null, '  ');
            let sharesMessage = `Shares: \n${sharesJson}`;
            if (this.args.output) {
                yield (0, helpers_1.writeFile)(this.args.output, sharesJson);
                sharesMessage = `${sharesMessage}\n\nDumped to: ${this.args.output}`;
            }
            return `${sharesMessage}`;
        });
    }
}
exports.BuildSharesAction = BuildSharesAction;
//# sourceMappingURL=BuildSharesAction.js.map