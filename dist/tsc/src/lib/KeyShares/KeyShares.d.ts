import { KeySharesItem } from './KeySharesItem';
/**
 * Represents a collection of KeyShares items with functionality for serialization,
 * deserialization, and validation.
 */
export declare class KeyShares {
    private shares;
    constructor(shares?: KeySharesItem[]);
    /**
     * Add a single KeyShares item to the collection.
     * @param keySharesItem The KeyShares item to add.
     */
    add(keySharesItem: KeySharesItem): void;
    list(): KeySharesItem[];
    /**
     * Validate the KeyShares instance using class-validator.
     * @returns The validation result.
     */
    validate(): any;
    /**
     * Converts the KeyShares instance to a JSON string.
     * @returns The JSON string representation of the KeyShares instance.
     */
    toJson(): string;
    /**
     * Initialize the KeyShares instance from JSON or object data.
     * @param content The JSON string or object to initialize from.
     * @returns The KeyShares instance.
     * @throws Error if the version is incompatible or the shares array is invalid.
     */
    static fromJson(content: string | any): Promise<KeyShares>;
}
