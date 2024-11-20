import { IKeySharesPartialPayload, IKeySharesPayload } from './IKeySharesPayload';
/**
 * Key Shares Payload
 */
export declare class KeySharesPayload implements IKeySharesPayload {
    sharesData: string;
    publicKey: string;
    operatorIds: number[];
    /**
     * Converts arrays of public and private keys to a single hexadecimal string.
     * @param publicKeys Array of public keys.
     * @param privateKeys Array of private keys.
     * @returns Hexadecimal string representation of keys.
     */
    private _sharesToBytes;
    /**
     * Updates the payload with new data and validates it.
     * @param data Partial key shares payload to update.
     */
    update(data: IKeySharesPartialPayload): void;
    /**
     * Validates the current state of the instance.
     * @returns {void | ValidationError[]} Validation errors if any, otherwise undefined.
     */
    validate(): any;
    /**
     * Builds the payload from the given data.
     * @param data Data to build the payload.
     * @returns {KeySharesPayload} The current instance for chaining.
     */
    build(data: any): KeySharesPayload;
}
