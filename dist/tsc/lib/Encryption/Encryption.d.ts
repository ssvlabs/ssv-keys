import { IShares } from '../Threshold';
export declare class InvalidOperatorKeyException extends Error {
    operator: any;
    constructor(operator: {
        rsa: string;
        base64: string;
    }, message: string);
}
export interface EncryptShare {
    operatorPublicKey: string;
    privateKey: string;
    publicKey: string;
}
export default class Encryption {
    private readonly operators;
    private readonly shares;
    constructor(operators: string[], shares: IShares[]);
    encrypt(): EncryptShare[];
}
