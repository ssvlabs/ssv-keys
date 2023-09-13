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
        help: 'The validator keystore file/folder path, if a folder is provided all keystore files within the provided folder will be split according to the provided arguments'
    },
    interactive: {
        options: {
            type: 'text',
            message: 'Provide the keystore file path',
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
        }
    }
};
//# sourceMappingURL=keystore-path.js.map