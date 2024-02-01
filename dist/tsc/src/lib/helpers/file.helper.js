"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeyStoreFiles = exports.getFilePath = exports.getSSVDir = exports.createSSVDir = exports.writeFile = exports.readFile = void 0;
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const fs_2 = require("fs");
const base_1 = require("../../lib/exceptions/base");
/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
const readFile = async (filePath, json = true) => {
    return fs_2.promises.readFile(filePath, { encoding: 'utf-8' }).then((data) => {
        return json ? JSON.parse(data) : data;
    });
};
exports.readFile = readFile;
/**
 * Write file contents.
 * @param filePath
 * @param data
 */
const writeFile = async (filePath, data) => {
    fs_2.promises.writeFile(filePath, data, { encoding: 'utf-8' });
};
exports.writeFile = writeFile;
/**
 * Create SSV keys directory to work in scope of in user home directory
 */
const createSSVDir = async (outputFolder) => {
    return fs_2.promises.mkdir(outputFolder, { recursive: true });
};
exports.createSSVDir = createSSVDir;
/**
 * Get SSV keys directory to work in scope of in user home directory.
 * Create it before, if it doesn't exist.
 */
const getSSVDir = async (outputFolder) => {
    if (!fs_1.default.existsSync(outputFolder)) {
        await (0, exports.createSSVDir)(outputFolder);
    }
    return outputFolder.endsWith(path_1.default.sep) ? outputFolder : `${outputFolder}${path_1.default.sep}`;
};
exports.getSSVDir = getSSVDir;
const getFilePath = async (name, outputFolder, withTime = true) => {
    return `${await (0, exports.getSSVDir)(outputFolder)}${name}${withTime ? `-${(0, moment_1.default)().unix()}` : ''}.json`;
};
exports.getFilePath = getFilePath;
const getKeyStoreFiles = async (keystorePath) => {
    let isFolder = false;
    let files;
    try {
        // Attempt to open the directory to determine if the path is a folder
        const dir = await fs_2.promises.opendir(keystorePath);
        isFolder = true;
        files = [];
        for await (const dirent of dir) {
            files.push(path_1.default.join(keystorePath, dirent.name));
        }
        if (files.length === 0) {
            throw new base_1.SSVKeysException('No keystore files detected. Please provide a folder with correct keystore files and try again.');
        }
    }
    catch (error) {
        if (error.code === 'ENOTDIR') {
            // It's not a directory, assume it's a file path
            isFolder = false;
            files = [keystorePath];
        }
        else {
            // Other errors are re-thrown
            throw new base_1.SSVKeysException(error.message);
        }
    }
    files.sort(); // Sort the files array regardless of how it was populated
    return { files, isFolder };
};
exports.getKeyStoreFiles = getKeyStoreFiles;
//# sourceMappingURL=file.helper.js.map