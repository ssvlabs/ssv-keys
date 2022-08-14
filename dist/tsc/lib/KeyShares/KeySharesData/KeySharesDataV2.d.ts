export interface IOperatorV2 {
    id: number;
    publicKey: string;
}
export interface ISharesV2 {
    publicKeys: string[];
    encryptedKeys: string[];
}
export interface IKeySharesParamsV2 {
    operators: IOperatorV2[];
    shares: ISharesV2;
    publicKey: string;
}
export declare class KeySharesKeysV2 {
    publicKeys: string[];
    encryptedKeys: string[];
    constructor(publicKeys: string[], encryptedKeys: string[]);
}
export declare class OperatorV2 {
    id: number;
    publicKey: string;
    constructor(id: number, publicKey: string);
}
export declare class KeySharesDataV2 {
    publicKey: string;
    operators: OperatorV2[];
    shares: KeySharesKeysV2;
    constructor(data: IKeySharesParamsV2);
    /**
     * Get the list of shares public keys.
     */
    get sharesPublicKeys(): string[];
    /**
     * Get the list of encrypted shares.
     */
    get sharesEncryptedKeys(): string[];
    /**
     * Get the list of operators IDs.
     */
    get operatorIds(): number[];
    /**
     * Get the list of operators public keys.
     */
    get operatorPublicKeys(): string[];
    /**
     * Try to BLS deserialize validator public key.
     */
    validateValidatorPublicKey(): Promise<any>;
    /**
     * Try to BLS deserialize shares public keys.
     */
    validateSharesPublicKeys(): Promise<any>;
    /**
     * If shares encrypted keys are ABI encoded - try to decode them.
     */
    validateSharesEncryptedKeys(): Promise<any>;
    /**
     * Check that counts are consistent.
     */
    validateCounts(): Promise<any>;
    /**
     * Go over operator public keys and try to check if they are:
     * 1) valid base 64 strings
     * 2) when base 64 decoded - valid RSA public key
     */
    validateOperatorsPublicKeys(): Promise<any>;
    /**
     * Do all possible validations.
     */
    validate(): Promise<any>;
}
