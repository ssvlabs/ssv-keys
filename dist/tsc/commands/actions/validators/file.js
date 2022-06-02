"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExistsValidator = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const fileExistsValidator = (filePath) => {
    return fs_1.default.existsSync(filePath.trim()) ? true : 'File does not exists';
};
exports.fileExistsValidator = fileExistsValidator;
//# sourceMappingURL=file.js.map