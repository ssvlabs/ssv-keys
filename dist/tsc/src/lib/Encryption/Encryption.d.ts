import { IShares } from '../Threshold';
export interface EncryptShare {
    operatorPublicKey: string;
    privateKey: string;
    publicKey: string;
}
export default class Encryption {
    private readonly operatorPublicKeys;
    private readonly shares;
    constructor(operatorPublicKeys: string[], shares: IShares[]);
    encrypt(): EncryptShare[];
}
