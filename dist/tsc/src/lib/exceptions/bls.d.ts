export declare class BLSDeserializeError extends Error {
    publicKey: string;
    constructor(publicKey: string, message: string);
}
export declare class SingleSharesSignatureInvalid extends Error {
    data: string;
    constructor(data: string, message: string);
}
