import { KeySharesDataV2 } from './KeySharesData/KeySharesDataV2';
export declare type KeySharesData = KeySharesDataV2;
/**
 * Keyshares data interface.
 */
export declare class KeyShares {
    static VERSION_V2: string;
    version: string;
    data: KeySharesData;
    payload: string;
    /**
     * Receives as parameter already read and json parsed structure.
     * @param version
     * @param data
     * @param payload
     */
    constructor({ version, data, payload }: {
        version: string;
        data: KeySharesData;
        payload?: string;
    });
    /**
     * Set final payload for web3 transaction.
     * @param payload
     */
    setPayload(payload: string): KeyShares;
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
