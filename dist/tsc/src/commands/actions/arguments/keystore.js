"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators");
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
exports.default = {
    arg1: '-ks',
    arg2: '--keystore',
    options: {
        required: false,
        type: String,
        help: 'The validator keystore file path. Only one keystore file can be specified using this argument'
    },
    interactive: {
        options: {
            type: 'text',
            message: 'Provide the keystore file path',
            validateSingle: (filePath) => {
                filePath = (0, validators_1.sanitizePath)(String(filePath).trim());
                let isValid = (0, validators_1.fileExistsValidator)(filePath);
                if (isValid !== true) {
                    return isValid;
                }
                isValid = (0, validators_1.jsonFileValidator)(filePath);
                if (isValid !== true) {
                    return isValid;
                }
                return true;
            },
        }
    }
};
//# sourceMappingURL=keystore.js.map