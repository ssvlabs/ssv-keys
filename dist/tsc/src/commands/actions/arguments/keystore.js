"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keystore_password_1 = require("../validators/keystore-password");
const file_1 = require("../validators/file");
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
exports.default = {
    arg1: '-ks',
    arg2: '--keystore',
    options: {
        required: true,
        type: String,
        help: 'The validator keystore file path'
    },
    interactive: {
        options: {
            type: 'text',
            validate: (filePath) => {
                filePath = (0, file_1.sanitizePath)(String(filePath).trim());
                let isValid = (0, file_1.fileExistsValidator)(filePath);
                if (isValid !== true) {
                    return isValid;
                }
                isValid = (0, file_1.jsonFileValidator)(filePath);
                if (isValid !== true) {
                    return isValid;
                }
                keystore_password_1.keystorePasswordValidator.setKeystoreFilePath(filePath);
                return true;
            },
        }
    }
};
//# sourceMappingURL=keystore.js.map