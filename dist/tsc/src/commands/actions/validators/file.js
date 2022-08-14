"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonFileValidator = exports.fileExistsValidator = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const fileExistsValidator = (filePath, message = '') => {
    return fs_1.default.existsSync(filePath.trim()) ? true : message || 'File does not exists';
};
exports.fileExistsValidator = fileExistsValidator;
const jsonFileValidator = (filePath, message = '') => {
    let fileContents;
    try {
        fileContents = fs_1.default.readFileSync(filePath, { encoding: 'utf-8' });
    }
    catch (e) {
        return message || 'Can not read file';
    }
    try {
        JSON.parse(fileContents);
    }
    catch (e) {
        return message || 'File is not a JSON file';
    }
    return true;
};
exports.jsonFileValidator = jsonFileValidator;
//# sourceMappingURL=file.js.map