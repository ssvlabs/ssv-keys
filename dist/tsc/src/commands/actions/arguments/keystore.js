"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const file_helper_1 = require("../../../lib/helpers/file.helper");
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
        help: 'The validator keystore file(s) path'
    },
    interactive: {
        confirmMessage: `{value} keystore files detected would you like to proceed with key distribution?`,
        confirmConditions: (filePath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { files, isFolder } = yield (0, file_helper_1.getKeyStoreFiles)(filePath);
            if (isFolder) {
                return files.length;
            }
            return false;
        }),
        options: {
            type: 'text',
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
//# sourceMappingURL=keystore.js.map