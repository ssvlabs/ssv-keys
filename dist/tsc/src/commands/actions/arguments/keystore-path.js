"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../validators/file");
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
exports.default = {
    arg1: '-kp',
    arg2: '--keystore-path',
    options: {
        required: true,
        type: String,
        help: 'The validator keystore file(s) path'
    },
    interactive: {
        options: {
            type: 'text',
        },
    },
    validateSingle: (filePath) => {
        filePath = (0, file_1.sanitizePath)(String(filePath).trim());
        let isValid = (0, file_1.fileExistsValidator)(filePath);
        if (isValid !== true) {
            return isValid;
        }
        isValid = (0, file_1.jsonFileValidator)(filePath);
        if (isValid !== true) {
            return isValid;
        }
        return true;
    },
};
//# sourceMappingURL=keystore-path.js.map