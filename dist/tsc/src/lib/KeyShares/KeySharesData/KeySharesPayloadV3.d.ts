import { IKeySharesPayload } from './IKeySharesPayload';
/**
 * Key Shares Payload v2.
 */
export declare class KeySharesPayloadV3 implements IKeySharesPayload {
    static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY: number;
    static PAYLOAD_INDEX_OPERATOR_IDS: number;
    static PAYLOAD_INDEX_SHARES_KEYS: number;
    static PAYLOAD_INDEX_SSV_AMOUNT: number;
    readable?: any;
    raw?: string | null;
    private decodeRSAShares;
    private sharesToBytes;
    build(data: any): any;
    /**
     * Setting data in array or object format or cleaning it up.
     * @param data
     */
    setData(data: any): any;
    /**
     * Building raw payload for web3.
     * @param payload
     */
    toRaw(payload: any[]): any;
    /**
     * Building readable payload structure.
     * @param payload
     */
    toReadable(payload: any[]): any;
    validate(): any;
}
