"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizePath = exports.jsonFileValidator = exports.fileExistsValidator = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const fileExistsValidator = (filePath, message = '') => {
    filePath = (0, exports.sanitizePath)(String(filePath).trim());
    try {
        fs_1.default.statSync(filePath);
        return true;
    }
    catch (error) {
        // Handle the error when the file does not exist
        return message || error.message || 'Couldn’t locate the keystore file.';
    }
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
const sanitizePath = (inputPath) => {
    // Strip quotes from the beginning or end of the path.
    const strippedPath = inputPath.replace(/^["']|["']$/g, '');
    // Normalize the path to handle different OS path formats and resolve '..' and '.' segments.
    let sanitizedPath = path_1.default.normalize(strippedPath);
    // Optionally, expand the regex to allow additional valid characters as needed.
    // The current regex allows alphanumeric, spaces, hyphens, underscores, periods, and path separators.
    // Modify this regex based on your specific requirements.
    sanitizedPath = sanitizedPath.replace(/[^a-zA-Z0-9 _\-.\\\/]/g, '');
    // Handle Windows-specific path formatting (like drive letters).
    if (process.platform === 'win32') {
        console.log('[debug] windows');
        const driveLetterMatch = sanitizedPath.match(/^([a-zA-Z]:)/);
        if (driveLetterMatch) {
            // Normalize the drive letter to uppercase.
            sanitizedPath = driveLetterMatch[1].toUpperCase() + sanitizedPath.substring(driveLetterMatch[1].length);
        }
        console.log('[debug] windows sanitizedPath:', sanitizedPath);
    }
    return sanitizedPath;
};
exports.sanitizePath = sanitizePath;
//# sourceMappingURL=file.js.map