"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keystorePasswordValidator = exports.KeystorePasswordValidator = void 0;
const tslib_1 = require("tslib");
const eth2_keystore_js_1 = tslib_1.__importDefault(require("eth2-keystore-js"));
const file_helper_1 = require("../../../lib/helpers/file.helper");
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
            const errorMessage = 'Invalid keystore file password.';
            let messageInterval;
            let output;
            try {
                let dots = 1;
                const message = `\rChecking password`;
                process.stdout.write('\r' + String(' ').repeat(250));
                process.stdout.write(`\r${message}`);
                messageInterval = setInterval(() => {
                    const progressMessage = `\r${message}` +
                        `${String('.').repeat(dots)}${String(' ').repeat(30 - dots)}`;
                    process.stdout.write(progressMessage);
                    dots += 1;
                    if (dots > 3) {
                        dots = 1;
                    }
                }, 1000);
                const data = yield (0, file_helper_1.readFile)(this.keystoreFilePath);
                const keyStore = new eth2_keystore_js_1.default(data);
                const privateKey = yield keyStore.getPrivateKey(password);
                output = !!privateKey;
            }
            catch (e) {
                output = errorMessage;
            }
            process.stdout.write('\n');
            clearInterval(messageInterval);
            return output;
        });
    }
}
exports.KeystorePasswordValidator = KeystorePasswordValidator;
exports.keystorePasswordValidator = new KeystorePasswordValidator();
//# sourceMappingURL=keystore-password.js.map