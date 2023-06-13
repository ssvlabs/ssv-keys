export declare class KeyStoreDataFormatError extends Error {
    data: any;
    constructor(data: any, message: string);
}
export declare class KeyStoreInvalidError extends Error {
    data: any;
    constructor(data: any, message: string);
}
export declare class KeyStorePasswordError extends Error {
    constructor(message: string);
}
export declare class EthereumWalletError extends Error {
    constructor(message: string);
}
export declare class PrivateKeyFormatError extends Error {
    data: any;
    constructor(data: any, message: string);
}
export declare class OwnerAddressFormatError extends Error {
    data: any;
    constructor(data: any, message: string);
}
export declare class OwnerNonceFormatError extends Error {
    data: any;
    constructor(data: any, message: string);
}
