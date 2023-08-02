"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readOperatorsDistributionFile = exports.readOperatorsFile = exports.getKeyStoreFiles = exports.getFilePath = exports.getSSVDir = exports.createSSVDir = exports.writeFile = exports.readFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const fs_2 = require("fs");
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
    fs_2.promises.writeFile(filePath, data, { encoding: 'utf-8' });
});
exports.writeFile = writeFile;
/**
 * Create SSV keys directory to work in scope of in user home directory
 */
const createSSVDir = (outputFolder) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return fs_2.promises.mkdir(outputFolder, { recursive: true });
});
exports.createSSVDir = createSSVDir;
/**
 * Get SSV keys directory to work in scope of in user home directory.
 * Create it before, if it doesn't exist.
 */
const getSSVDir = (outputFolder) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!fs_1.default.existsSync(outputFolder)) {
        yield (0, exports.createSSVDir)(outputFolder);
    }
    return outputFolder.endsWith(path_1.default.sep) ? outputFolder : `${outputFolder}${path_1.default.sep}`;
});
exports.getSSVDir = getSSVDir;
const getFilePath = (name, outputFolder, postfixName, withTime = true) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return `${yield (0, exports.getSSVDir)(outputFolder)}${name}${withTime ? `-${(0, moment_1.default)().unix()}` : ''}${postfixName || ''}.json`;
});
exports.getFilePath = getFilePath;
const getKeyStoreFiles = (keystorePath) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const stat = yield fs_2.promises.stat(keystorePath);
    const isFolder = stat.isDirectory();
    let files;
    if (isFolder) {
        const folderContent = yield fs_2.promises.readdir(keystorePath);
        if (folderContent.length === 0) {
            throw Error('No keystore files detected please provide a folder with correct keystore files and try again');
        }
        files = folderContent.map(file => path_1.default.join(keystorePath, file)).sort();
    }
    else {
        files = [keystorePath];
    }
    return { files, isFolder };
});
exports.getKeyStoreFiles = getKeyStoreFiles;
const readOperatorsFile = (filePath) => {
    const data = fs_1.default.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const operators = new Map();
    lines.forEach(line => {
        const [id, operatorKey] = line.split(',');
        operators.set(Number(id), operatorKey);
    });
    return operators;
};
exports.readOperatorsFile = readOperatorsFile;
const readOperatorsDistributionFile = (filePath) => {
    const data = fs_1.default.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n');
    return lines.map(line => line.split(',').map(Number));
};
exports.readOperatorsDistributionFile = readOperatorsDistributionFile;
//# sourceMappingURL=file.helper.js.map