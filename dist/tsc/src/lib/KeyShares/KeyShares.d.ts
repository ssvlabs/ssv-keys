import { KeySharesDataV3 } from './KeySharesData/KeySharesDataV3';
import { KeySharesPayloadV3 } from './KeySharesData/KeySharesPayloadV3';
export declare type KeySharesData = KeySharesDataV3;
export declare type KeySharesPayload = KeySharesPayloadV3;
/**
 * Key shares file data interface.
 */
export declare class KeyShares {
    static VERSION_V2: string;
    static VERSION_V3: string;
    private byVersion;
    version: string;
    data: KeySharesData;
    payload: KeySharesPayload;
    /**
     * @param version
     */
    constructor({ version }: {
        version: string;
    });
    init(data: string | any): KeyShares;
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    generateContractPayload(data: any): void;
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
     * Get final data converted from raw data.
     * @param data
     * @param version
     */
    useData(data: any): void;
    /**
     * Validate everything
     */
    validate(): any;
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toString(): string;
}
