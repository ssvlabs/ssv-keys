"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateKeyStorePathData = void 0;
const keyStorePathData = {};
const updateKeyStorePathData = (isFolder, filesCount) => {
    keyStorePathData.isFolder = isFolder;
    keyStorePathData.filesCount = filesCount;
};
exports.updateKeyStorePathData = updateKeyStorePathData;
exports.default = {
    arg1: '-ms',
    arg2: '--multi-shares',
    options: {
        action: 'store_true',
        default: false,
        required: false,
        help: 'Keystore path will accept multiple keystores from a folder path, all files must have the same password.'
    }
};
//# sourceMappingURL=multi-shares.js.map