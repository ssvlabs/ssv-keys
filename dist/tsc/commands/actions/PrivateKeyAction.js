"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKeyAction = void 0;
const tslib_1 = require("tslib");
const helpers_1 = require("../../lib/helpers");
const BaseAction_1 = require("./BaseAction");
class PrivateKeyAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'decrypt',
            shortAction: 'dec',
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
                        }
                    }
                },
                {
                    arg1: '-ps',
                    arg2: '--password',
                    options: {
                        required: true,
                        type: String,
                        help: 'Password for keystore'
                    },
                    interactive: {
                        options: {
                            type: 'password',
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
            const data = yield (0, helpers_1.readFile)(this.args.keystore);
            const privateKey = yield this.ssvKeys.getPrivateKeyFromKeystoreData(data, this.args.password);
            return `Private key from keystore: ${privateKey}`;
        });
    }
}
exports.PrivateKeyAction = PrivateKeyAction;
//# sourceMappingURL=PrivateKeyAction.js.map