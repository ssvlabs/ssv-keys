import { SSVKeysException } from './base';
export declare class KeyStoreDataFormatError extends SSVKeysException {
    data: any;
    constructor(data: any, message: string);
}
export declare class KeyStoreInvalidError extends SSVKeysException {
    data: any;
    constructor(data: any, message: string);
}
export declare class KeyStorePasswordError extends SSVKeysException {
    constructor(message: string);
}
export declare class EthereumWalletError extends SSVKeysException {
    constructor(message: string);
}
export declare class PrivateKeyFormatError extends SSVKeysException {
    data: any;
    constructor(data: any, message: string);
}
export declare class OwnerAddressFormatError extends SSVKeysException {
    data: any;
    constructor(data: any, message: string);
}
export declare class OwnerNonceFormatError extends SSVKeysException {
    data: any;
    constructor(data: any, message: string);
}
