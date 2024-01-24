"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators");
const validateKeystoreFile = (path) => {
    const validation = (0, validators_1.fileExistsValidator)(path);
    if (validation !== true) {
        return { isValid: false, error: validation };
    }
    return { isValid: true };
};
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
exports.default = {
    arg1: '-ks',
    arg2: '--keystore',
    options: {
        required: false,
        type: String,
        help: 'Path to a validator keystore file or a directory of keystore files for bulk processing'
    },
    interactive: {
        options: {
            type: 'text',
            message: 'Enter the path to your keystore file or directory containing multiple keystore files',
            validate: (filePath) => {
                const result = validateKeystoreFile(filePath);
                return result.isValid || result.error;
            },
        }
    }
};
//# sourceMappingURL=keystore.js.map