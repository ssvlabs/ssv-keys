export interface IKeySharesPayloadV2 {
    readable?: any;
    raw?: string;
}
export declare class KeySharesPayloadV2 {
    readable: any;
    raw: string;
    constructor(data: IKeySharesPayloadV2);
    /**
     * Do all possible validations.
     */
    validate(): Promise<any>;
}
