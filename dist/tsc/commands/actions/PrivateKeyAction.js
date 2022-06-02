"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKeyAction = void 0;
const tslib_1 = require("tslib");
const safe_1 = tslib_1.__importDefault(require("colors/safe"));
const BaseAction_1 = require("./BaseAction");
const helpers_1 = require("../../lib/helpers");
const file_1 = require("./validators/file");
class PrivateKeyAction extends BaseAction_1.BaseAction {
    static get options() {
        return {
            action: 'decrypt',
            shortAction: 'dec',
            description: 'Decrypt keystore using password and get private key from it',
            arguments: [
                {
                    arg1: '-ks',
                    arg2: '--keystore',
                    options: {
                        required: true,
                        type: String,
                        help: 'Provide your keystore file path',
                    },
                    interactive: {
                        options: {
                            type: 'text',
                            validate: file_1.fileExistsValidator
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
                }
            ],
        };
    }
    /**
     * Decrypt and return private key.
     */
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield (0, helpers_1.readFile)(String(this.args.keystore).trim());
            const privateKey = yield this.ssvKeys.getPrivateKeyFromKeystoreData(data, this.args.password);
            return `\n\n\tPrivate key from keystore ➡️  ${safe_1.default.bgYellow(safe_1.default.black(privateKey))}\n\n` +
                '\t' + safe_1.default.bgRed(safe_1.default.white('#########################################\n')) +
                '\t' + safe_1.default.bgRed(safe_1.default.white('########### ⚠️  PLEASE NOTICE  ###########\n')) +
                '\t' + safe_1.default.bgRed(safe_1.default.white('#########################################\n')) +
                '\t' + safe_1.default.bgRed(safe_1.default.white('# KEEP YOUR PRIVATE KEY SAFE AND SECRET #\n')) +
                '\t' + safe_1.default.bgRed(safe_1.default.white('#       NEVER GIVE IT TO ANYONE!!!      #\n')) +
                '\t' + safe_1.default.bgRed(safe_1.default.white('#########################################\n'));
        });
    }
}
exports.PrivateKeyAction = PrivateKeyAction;
//# sourceMappingURL=PrivateKeyAction.js.map