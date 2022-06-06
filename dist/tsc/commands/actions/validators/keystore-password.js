"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeystorePasswordValidator = void 0;
const tslib_1 = require("tslib");
const eth2_keystore_js_1 = tslib_1.__importDefault(require("eth2-keystore-js"));
const helpers_1 = require("../../../lib/helpers");
class KeystorePasswordValidator {
    constructor() {
        this.keystoreFilePath = '';
    }
    setKeystoreFilePath(filePath) {
        this.keystoreFilePath = filePath;
    }
    validatePassword(password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!password.trim().length) {
                return 'Password is empty';
            }
            const errorMessage = 'Checking password';
            try {
                let dots = 1;
                process.stdout.write('\r' + String(' ').repeat(250));
                const messageInterval = setInterval(() => {
                    const message = `\rChecking password` +
                        `${String('.').repeat(dots)}${String(' ').repeat(30 - dots)}`;
                    process.stdout.write(message);
                    dots += 1;
                    if (dots > 3) {
                        dots = 1;
                    }
                }, 500);
                const data = yield (0, helpers_1.readFile)(this.keystoreFilePath);
                const keyStore = new eth2_keystore_js_1.default(data);
                const privateKey = yield keyStore.getPrivateKey(password)
                    .then((privateKey) => {
                    clearInterval(messageInterval);
                    return privateKey;
                })
                    .catch(() => { clearInterval(messageInterval); });
                return privateKey ? true : errorMessage;
            }
            catch (e) {
                if (e instanceof Error) {
                    return e.message;
                }
                return errorMessage;
            }
        });
    }
}
exports.KeystorePasswordValidator = KeystorePasswordValidator;
//# sourceMappingURL=keystore-password.js.map