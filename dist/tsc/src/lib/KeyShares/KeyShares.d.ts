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
    registerNonce: number;
    privateKey: string;
}
export interface IKeySharesFromSignatureData {
    ownerAddress: string;
    registerNonce: number;
    publicKey: string;
}
/**
 * Key shares file data interface.
 */
export declare class KeyShares {
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
     * Set new data and validate it.
     * @param data
     */
    update(data: IKeySharesPartitialData): void;
    /**
     * Validate everything
     */
    validate(): any;
    /**
     * Initialise from JSON or object data.
     */
    fromJson(content: string | any): KeyShares;
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson(): string;
    private _splitArray;
}
