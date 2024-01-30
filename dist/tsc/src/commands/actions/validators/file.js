"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePath = exports.jsonFileValidator = exports.fileExistsValidator = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const fileExistsValidator = (filePath, message = '') => {
    filePath = (0, exports.sanitizePath)(String(filePath).trim());
    const exists = fs_1.default.existsSync(filePath);
    return exists || message || 'Couldn’t locate the keystores file path. Please provide a valid path.';
};
exports.fileExistsValidator = fileExistsValidator;
const jsonFileValidator = (filePath, message = '') => {
    let fileContents;
    filePath = (0, exports.sanitizePath)(filePath);
    try {
        fileContents = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
    }
    catch (e) {
        return message || 'Couldn’t read a validator keystore file';
    }
    try {
        JSON.parse(fileContents);
    }
    catch (e) {
        return `Keystore file "${filePath}" must be .JSON format`;
    }
    return true;
};
exports.jsonFileValidator = jsonFileValidator;
/**
 * Make sure the path contains
 * @param path
 * @param regex
 */
const sanitizePath = (inputPath) => {
    // Strip quotes from the beginning or end.
    const strippedPath = inputPath.replace(/^["']|["']$/g, '');
    // Remove any characters that are not typically allowed or are problematic in file paths.
    // Here, we're allowing alphanumeric characters, spaces, hyphens, underscores, and periods.
    // You can adjust the regex as needed.
    const sanitizedPath = strippedPath.replace(/\\([^a-zA-Z0-9_])/g, "$1");
    // On Windows, paths might start with a drive letter. We can check and ensure it's a valid drive letter.
    /*
    if (process.platform === 'win32') {
      const match = sanitizedPath.match(/^([a-zA-Z]:)/);
      if (match) {
        // Ensure the drive letter is uppercase (just a normalization step; not strictly necessary).
        sanitizedPath = match[1].toUpperCase() + sanitizedPath.substring(match[1].length);
      }
    }
    */
    return sanitizedPath;
};
exports.sanitizePath = sanitizePath;
//# sourceMappingURL=file.js.map