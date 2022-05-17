"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildSharesAction = void 0;
const tslib_1 = require("tslib");
const helpers_1 = require("../../lib/helpers");
const BaseAction_1 = require("./BaseAction");
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
                    arg1: '-o',
                    arg2: '--output',
                    options: {
                        type: String,
                        help: 'Write result as JSON to specified file'
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
            const threshold = yield this.ssvKeys.createThreshold(this.args.private_key);
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