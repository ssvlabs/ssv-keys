import { BaseCustomError } from './base';
export declare class KeyStoreDataFormatError extends BaseCustomError {
    data: any;
    constructor(data: any, message: string);
}
export declare class KeyStoreInvalidError extends BaseCustomError {
    data: any;
    constructor(data: any, message: string);
}
export declare class KeyStorePasswordError extends BaseCustomError {
    constructor(message: string);
}
export declare class EthereumWalletError extends BaseCustomError {
    constructor(message: string);
}
export declare class PrivateKeyFormatError extends BaseCustomError {
    data: any;
    constructor(data: any, message: string);
}
export declare class OwnerAddressFormatError extends BaseCustomError {
    data: any;
    constructor(data: any, message: string);
}
export declare class OwnerNonceFormatError extends BaseCustomError {
    data: any;
    constructor(data: any, message: string);
}
