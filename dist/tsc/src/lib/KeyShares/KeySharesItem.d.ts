import { KeySharesData } from './KeySharesData/KeySharesData';
import { KeySharesPayload } from './KeySharesData/KeySharesPayload';
import { EncryptShare } from '../Encryption/Encryption';
import { IKeySharesPartitialData } from './KeySharesData/IKeySharesData';
import { IOperator } from './KeySharesData/IOperator';
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
    constructor();
    /**
     * Build payload from operators list, encrypted shares and validator public key
     * @param publicKey
     * @param operatorIds
     * @param encryptedShares
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
     * @param data Partial key shares data.
     * @param payload Partial key shares payload.
     */
    update(data: IKeySharesPartitialData): void;
    /**
     * Validate everything
     */
    validate(): any;
    /**
     * Initialise from JSON or object data.
     */
    fromJson(content: string | any): Promise<KeySharesItem>;
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson(): string;
    private splitArray;
}
