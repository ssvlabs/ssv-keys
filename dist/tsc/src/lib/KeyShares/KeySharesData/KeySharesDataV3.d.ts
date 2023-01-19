import { IKeySharesData } from './IKeySharesData';
import { OperatorDataV3 } from './OperatorDataV3';
import { KeySharesKeysV3 } from './KeySharesKeysV3';
export declare class KeySharesDataV3 implements IKeySharesData {
    publicKey?: string | null;
    operators?: OperatorDataV3[] | null;
    shares?: KeySharesKeysV3 | null;
    setData(data: any): void;
    /**
     * Do all possible validations.
     */
    validate(): void;
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
    validatePublicKey(): void;
    /**
     * Check that counts are consistent.
     */
    validateCounts(): void;
    /**
     * Validate all operators
     */
    validateOperators(): void;
    /**
     * Do not allow to use duplicated operator IDs and public keys.
     */
    validateDuplicates(): void;
}
