"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumWalletError = exports.KeyStorePasswordError = exports.KeyStoreInvalidError = exports.KeyStoreDataFormatError = void 0;
class KeyStoreDataFormatError extends Error {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.KeyStoreDataFormatError = KeyStoreDataFormatError;
class KeyStoreInvalidError extends Error {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.KeyStoreInvalidError = KeyStoreInvalidError;
class KeyStorePasswordError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.KeyStorePasswordError = KeyStorePasswordError;
class EthereumWalletError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.EthereumWalletError = EthereumWalletError;
//# sourceMappingURL=keystore.js.map