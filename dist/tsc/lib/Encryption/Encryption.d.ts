import { IShares } from '../Threshold';
export interface EncryptShare {
    operatorPublicKey: string;
    privateKey: string;
    publicKey: string;
}
export default class Encryption {
    private readonly operators;
    private readonly shares;
    RAW_OPERATOR_PUBLIC_KEY_SIGNATURE: RegExp;
    constructor(operators: string[], shares: IShares[]);
    encrypt(): EncryptShare[];
}
