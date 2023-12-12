import { SSVKeysException } from './base';
export declare class BLSDeserializeError extends SSVKeysException {
    publicKey: string;
    constructor(publicKey: string, message: string);
}
export declare class SingleSharesSignatureInvalid extends SSVKeysException {
    data: string;
    constructor(data: string, message: string);
}
