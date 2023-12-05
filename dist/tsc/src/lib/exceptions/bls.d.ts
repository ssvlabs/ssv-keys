import { BaseCustomError } from './base';
export declare class BLSDeserializeError extends BaseCustomError {
    publicKey: string;
    constructor(publicKey: string, message: string);
}
export declare class SingleSharesSignatureInvalid extends BaseCustomError {
    data: string;
    constructor(data: string, message: string);
}
