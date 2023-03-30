import { IKeySharesPayload } from './IKeySharesPayload';
/**
 * Key Shares Payload v2.
 */
export declare class KeySharesPayloadV2 implements IKeySharesPayload {
    static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY: number;
    static PAYLOAD_INDEX_OPERATOR_IDS: number;
    static PAYLOAD_INDEX_SHARE_PUBLIC_KEYS: number;
    static PAYLOAD_INDEX_SHARE_PRIVATE_KEYS: number;
    readable?: any;
    raw?: string | undefined;
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
    validate(): Promise<any>;
}
