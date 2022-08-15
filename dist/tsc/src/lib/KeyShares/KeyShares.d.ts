import { KeySharesDataV2 } from './KeySharesData/KeySharesDataV2';
import { KeySharesPayloadV2 } from './KeySharesData/KeySharesPayloadV2';
export declare type KeySharesData = KeySharesDataV2;
export declare type KeySharesPayload = KeySharesPayloadV2;
/**
 * Keyshares data interface.
 */
export declare class KeyShares {
    static VERSION_V2: string;
    static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY: number;
    static PAYLOAD_INDEX_OPERATOR_IDS: number;
    static PAYLOAD_INDEX_SHARE_PUBLIC_KEYS: number;
    static PAYLOAD_INDEX_SHARE_PRIVATE_KEYS: number;
    static PAYLOAD_INDEX_SSV_AMOUNT: number;
    version: string;
    data?: KeySharesData | undefined;
    payload?: KeySharesPayload | undefined;
    /**
     * @param version
     */
    constructor({ version }: {
        version: string;
    });
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    setPayload(payload: any): Promise<KeyShares>;
    /**
     * Set new data and validate it.
     * @param data KeySharesData
     */
    setData(data: any): Promise<KeyShares>;
    /**
     * Instantiate keyshare from raw data as string or object.
     * @param data
     */
    static fromData(data: string | any): Promise<KeyShares>;
    /**
     * Get final data converted from raw data.
     * @param payload
     * @param version
     */
    usePayload(payload: any, version: string): KeySharesPayloadV2;
    /**
     * Get final data converted from raw data.
     * @param data
     * @param version
     */
    useData(data: any, version: string): KeySharesDataV2;
    /**
     * Validate everything
     */
    validate(): Promise<void>;
    /**
     * Validate payload
     */
    validatePayload(): Promise<void>;
    /**
     * Validate data
     */
    validateData(): Promise<void>;
    /**
     * Stringify keyshare to be ready for saving in file.
     */
    toString(): string;
}
