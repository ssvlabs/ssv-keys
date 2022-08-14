"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../validators/file");
const keystore_password_1 = require("../validators/keystore-password");
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
exports.default = {
    arg1: '-ks',
    arg2: '--keystore',
    options: {
        required: true,
        type: String,
        help: 'Valid keystore file path'
    },
    interactive: {
        options: {
            type: 'text',
            validate: (filePath) => {
                const message = 'Invalid keystore file';
                filePath = String(filePath).trim();
                let isValid = (0, file_1.fileExistsValidator)(filePath, message);
                if (isValid !== true) {
                    return isValid;
                }
                isValid = (0, file_1.jsonFileValidator)(filePath, message);
                if (isValid !== true) {
                    return isValid;
                }
                keystore_password_1.keystorePasswordValidator.setKeystoreFilePath(String(filePath).trim());
                return true;
            },
        }
    }
};
//# sourceMappingURL=keystore.js.map