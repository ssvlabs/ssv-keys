"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators");
const validateKeystoreFile = (filePath) => {
    let validation = (0, validators_1.fileExistsValidator)(filePath);
    if (validation !== true) {
        return { isValid: false, error: validation };
    }
    validation = (0, validators_1.jsonFileValidator)(filePath);
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
        help: 'The validator keystore file path. Only one keystore file can be specified using this argument'
    },
    interactive: {
        options: {
            type: 'text',
            message: 'Provide the keystore file path',
            validate: (filePath) => {
                const result = validateKeystoreFile(filePath);
                return result.isValid || result.error;
            },
        }
    }
};
//# sourceMappingURL=keystore.js.map