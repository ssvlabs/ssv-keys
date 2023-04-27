import { IKeySharesData } from './KeySharesData/IKeySharesData';
import { IKeySharesPayload } from './KeySharesData/IKeySharesPayload';
export type KeySharesData = IKeySharesData;
export type KeySharesPayload = IKeySharesPayload;
/**
 * Key shares file data interface.
 */
export declare class KeyShares {
    static VERSION_V3: string;
    private byVersion;
    version: string;
    data: KeySharesData;
    payload: KeySharesPayload;
    /**
     * @param version
     */
    constructor();
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    generateContractPayload(data: any): KeySharesPayload;
    generateKeySharesFromBytes(shares: string, operatorIds: any[]): any;
    private splitArray;
    /**
     * Set new data and validate it.
     * @param data
     */
    setData(data: any): void;
    /**
     * Get entity by version.
     * @param entity
     * @param version
     * @private
     */
    private getByVersion;
    /**
     * Validate everything
     */
    validate(): any;
    /**
     * Initialise from JSON or object data.
     */
    fromJson(data: string | any): KeyShares;
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson(): string;
}
