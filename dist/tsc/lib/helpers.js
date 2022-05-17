"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.readFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
const readFile = (filePath, json = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(json ? JSON.parse(data) : data);
            }
        });
    });
});
exports.readFile = readFile;
/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param data
 */
const writeFile = (filePath, data) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(filePath, data, { encoding: 'utf8' }, (error) => {
            if (error) {
                reject({ error });
            }
            else {
                resolve({ filePath, data });
            }
        });
    });
});
exports.writeFile = writeFile;
//# sourceMappingURL=helpers.js.map