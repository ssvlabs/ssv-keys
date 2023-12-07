"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerNonceFormatError = exports.OwnerAddressFormatError = exports.PrivateKeyFormatError = exports.EthereumWalletError = exports.KeyStorePasswordError = exports.KeyStoreInvalidError = exports.KeyStoreDataFormatError = void 0;
const base_1 = require("./base");
class KeyStoreDataFormatError extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.KeyStoreDataFormatError = KeyStoreDataFormatError;
class KeyStoreInvalidError extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.KeyStoreInvalidError = KeyStoreInvalidError;
class KeyStorePasswordError extends base_1.SSVKeysException {
    constructor(message) {
        super(message);
    }
}
exports.KeyStorePasswordError = KeyStorePasswordError;
class EthereumWalletError extends base_1.SSVKeysException {
    constructor(message) {
        super(message);
    }
}
exports.EthereumWalletError = EthereumWalletError;
class PrivateKeyFormatError extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.PrivateKeyFormatError = PrivateKeyFormatError;
class OwnerAddressFormatError extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.OwnerAddressFormatError = OwnerAddressFormatError;
class OwnerNonceFormatError extends base_1.SSVKeysException {
    constructor(data, message) {
        super(message);
        this.data = data;
    }
}
exports.OwnerNonceFormatError = OwnerNonceFormatError;
//# sourceMappingURL=keystore.js.map