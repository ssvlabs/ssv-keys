"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
const readFile = (filePath, json = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return fs_1.promises.readFile(filePath, { encoding: 'utf-8' }).then((data) => {
        return json ? JSON.parse(data) : data;
    });
});
exports.readFile = readFile;
/**
 * Write file contents.
 * @param filePath
 * @param data
 */
const writeFile = (filePath, data) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return fs_1.promises.writeFile(filePath, data, { encoding: 'utf-8' }).then(() => {
        return { filePath, data };
    });
});
exports.writeFile = writeFile;
//# sourceMappingURL=helpers.js.map