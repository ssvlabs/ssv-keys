import { KeySharesData } from './KeySharesData/KeySharesData';
import { KeySharesPayload } from './KeySharesData/KeySharesPayload';
import { EncryptShare } from '../Encryption/Encryption';
import { IKeySharesPartialData } from './KeySharesData/IKeySharesData';
import { IOperator } from './KeySharesData/IOperator';
import { SSVKeysException } from '../exceptions/base';
export interface IKeySharesPayloadData {
    publicKey: string;
    operators: IOperator[];
    encryptedShares: EncryptShare[];
}
export interface IKeySharesToSignatureData {
    ownerAddress: string;
    ownerNonce: number;
    privateKey: string;
}
export interface IKeySharesFromSignatureData {
    ownerAddress: string;
    ownerNonce: number;
    publicKey: string;
}
/**
 * Key shares file data interface.
 */
export declare class KeySharesItem {
    data: KeySharesData;
    payload: KeySharesPayload;
    error: SSVKeysException | undefined;
    constructor();
    /**
     * Build payload from operators list, encrypted shares and validator public key
     */
    buildPayload(metaData: IKeySharesPayloadData, toSignatureData: IKeySharesToSignatureData): Promise<any>;
    validateSingleShares(shares: string, fromSignatureData: IKeySharesFromSignatureData): Promise<void>;
    /**
     * Build shares from bytes string and operators list length
     * @param bytes
     * @param operatorCount
     */
    buildSharesFromBytes(bytes: string, operatorCount: number): any;
    /**
     * Updates the current instance with partial data and payload, and validates.
     */
    update(data: IKeySharesPartialData): void;
    /**
     * Validate everything
     */
    validate(): any;
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson(): string;
    private splitArray;
    /**
     * Initialise from JSON or object data.
     */
    static fromJson(content: string | any): Promise<KeySharesItem>;
}
