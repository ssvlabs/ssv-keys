import JSEncrypt from 'jsencrypt';
import { decode } from 'js-base64';
import { IShares } from '../Threshold';

export interface EncryptShare {
    operatorPublicKey: string,
    privateKey: string,
    publicKey: string
}

export default class Encryption {
    private readonly operators: string[];
    private readonly shares: IShares[];

    RAW_OPERATOR_PUBLIC_KEY_SIGNATURE = RegExp(/------BEGIN RSA PUBLIC KEY-----/, 'gmi');

    constructor(operators: string[], shares: IShares[]) {
        this.operators = operators.map((publicKey: string) => {
          if (this.RAW_OPERATOR_PUBLIC_KEY_SIGNATURE.test(publicKey)) {
            return publicKey;
          }
          return decode(publicKey);
        });
        this.shares = shares;
    }

    encrypt(): EncryptShare[] {
        const encryptedShares: EncryptShare[] = [];
        Object.keys(this.operators).forEach((operator: any) => {
            const encrypt = new JSEncrypt({});
            encrypt.setPublicKey(this.operators[operator]);
            const encrypted = encrypt.encrypt(this.shares[operator].privateKey);
            const encryptedShare: EncryptShare = {
                operatorPublicKey: this.operators[operator],
                privateKey: String(encrypted),
                publicKey: this.shares[operator].publicKey,
            };
            encryptedShares.push(encryptedShare);
            return encryptedShare;
        });
        return encryptedShares;
    }
}
