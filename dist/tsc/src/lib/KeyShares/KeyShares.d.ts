import { KeySharesDataV2 } from './KeySharesData/KeySharesDataV2';
import { KeySharesPayloadV2 } from './KeySharesData/KeySharesPayloadV2';
export declare type KeySharesData = KeySharesDataV2;
export declare type KeySharesPayload = KeySharesPayloadV2;
/**
 * Keyshares data interface.
 */
export declare class KeyShares {
    static VERSION_V2: string;
    version: string;
    data: KeySharesData;
    payload: KeySharesPayload;
    /**
     * Receives as parameter already read and json parsed structure.
     * @param version
     * @param data
     * @param payload
     */
    constructor({ version, data, payload }: {
        version: string;
        data: KeySharesData;
        payload: KeySharesPayload;
    });
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    setPayload(payload: KeySharesPayload): Promise<KeyShares>;
    /**
     * Set new data and validate it.
     * @param data
     */
    setData(data: KeySharesData): Promise<KeyShares>;
    /**
     * Instantiate keyshare from raw data as string or object.
     * @param data
     */
    static fromData(data: string | any): Promise<KeyShares>;
    /**
     * Stringify keyshare to be ready for saving in file.
     */
    toString(): string;
}
