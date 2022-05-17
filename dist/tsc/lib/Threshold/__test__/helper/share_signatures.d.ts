export interface Shares {
    validatorPrivateKey: any;
    validatorPublicKey: any;
    signatures: any[];
    ids: any[];
}
export declare const sharesSignatures: (privateKey: string, message: string, threshold: boolean) => Promise<Shares>;
