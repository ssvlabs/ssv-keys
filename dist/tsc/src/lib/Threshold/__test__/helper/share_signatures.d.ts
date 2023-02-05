export interface Shares {
    privateKey: any;
    publicKey: any;
    signatures: any[];
    ids: any[];
}
export declare const sharesSignatures: (_privateKey: string, operators: number[], message: string, isThreshold: boolean) => Promise<Shares>;
