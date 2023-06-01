import { IKeySharesPayload } from './IKeySharesPayload';
/**
 * Key Shares Payload
 */
export declare class KeySharesPayload implements IKeySharesPayload {
    readable: any;
    private decodeRSAShares;
    private sharesToBytes;
    build(data: any): any;
}
