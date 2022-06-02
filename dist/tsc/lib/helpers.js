"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilePath = exports.getSSVDir = exports.createSSVDir = exports.writeFile = exports.readFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const os = tslib_1.__importStar(require("os"));
const fs_2 = require("fs");
const moment_1 = tslib_1.__importDefault(require("moment"));
/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
const readFile = (filePath, json = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return fs_2.promises.readFile(filePath, { encoding: 'utf-8' }).then((data) => {
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
    return fs_2.promises.writeFile(filePath, data, { encoding: 'utf-8' }).then(() => {
        return { filePath, data };
    });
});
exports.writeFile = writeFile;
const ssvDir = `${path_1.default.join(os.homedir(), '.ssv', 'keys')}${path_1.default.sep}`;
/**
 * Create SSV keys directory to work in scope of in user home directory
 */
const createSSVDir = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return fs_2.promises.mkdir(ssvDir, { recursive: true });
});
exports.createSSVDir = createSSVDir;
/**
 * Get SSV keys directory to work in scope of in user home directory.
 * Create it before, if it doesn't exists.
 */
const getSSVDir = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!fs_1.default.existsSync(ssvDir)) {
        yield (0, exports.createSSVDir)();
    }
    return ssvDir;
});
exports.getSSVDir = getSSVDir;
const getFilePath = (name, withTime = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return `${yield (0, exports.getSSVDir)()}${name}${withTime ? '-' + (0, moment_1.default)().format('YYYYMMDD_hhmmss') : ''}.json`;
});
exports.getFilePath = getFilePath;
//# sourceMappingURL=helpers.js.map