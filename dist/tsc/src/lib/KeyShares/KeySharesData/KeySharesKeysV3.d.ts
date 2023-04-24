import { IKeySharesKeys } from './IKeySharesKeys';
export declare class KeySharesKeysV3 implements IKeySharesKeys {
    publicKeys: string[] | undefined;
    encryptedKeys: string[] | undefined;
    /**
     * Set public and encrypted keys from data.
     * @param data
     */
    setData(data: {
        publicKeys: string[] | null | undefined;
        encryptedKeys: string[] | null | undefined;
    }): void;
    /**
     * Validation of all data.
     */
    validate(): void;
}
