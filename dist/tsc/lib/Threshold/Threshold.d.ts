export interface IShares {
    privateKey: string;
    publicKey: string;
    id?: any;
}
export interface ISharesKeyPairs {
    validatorPrivateKey: string;
    validatorPublicKey: string;
    shares: IShares[];
}
/**
 * Building threshold for
 * Example of usage:
 *
 *  const threshold: Threshold = new Threshold();
 *  threshold.create('45df68ab75bb7ed1063b7615298e81c1ca1b0c362ef2e93937b7bba9d7c43a94').then((s) => {
 *    console.log(s);
 *  });
 */
declare class Threshold {
    protected validatorPublicKey: any;
    protected validatorPrivateKey: any;
    protected validatorShares: Array<any>;
    static get DEFAULT_SHARES_NUMBER(): number;
    static get DEFAULT_THRESHOLD_NUMBER(): number;
    /**
     * Generate keys and return promise
     */
    create(privateKey: string, sharesNumber?: number, thresholdNumber?: number): Promise<ISharesKeyPairs>;
}
export default Threshold;
