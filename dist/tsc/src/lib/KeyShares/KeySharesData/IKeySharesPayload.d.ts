export interface IKeySharesPayload {
    /**
     * Readable payload.
     */
    readable?: any;
    /**
     * Raw payload ready for using in web3 transaction.
     */
    raw?: string | undefined;
    /**
     * Build payload data.
     * @param data
     */
    build(data: any): any;
    /**
     * Set payload data.
     * @param data
     */
    setData(data: any): any;
    /**
     * Build readable payload from payload array.
     * @param payload
     */
    toReadable(payload: any[]): any;
    /**
     * Build raw payload for web3 transaction.
     * @param payload
     */
    toRaw(payload: any[]): any;
    /**
     * Perform validation of payload if necessary.
     */
    validate(): Promise<any>;
}
