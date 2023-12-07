import { SSVKeysException } from '../exceptions/base';
export interface IShares {
    privateKey: string;
    publicKey: string;
    id?: any;
}
export interface ISharesKeyPairs {
    privateKey: string;
    publicKey: string;
    shares: IShares[];
}
export declare class ThresholdInvalidOperatorsLengthError extends SSVKeysException {
    operators: number[];
    constructor(operators: number[], message: string);
}
export declare class ThresholdInvalidOperatorIdError extends SSVKeysException {
    operator: any;
    constructor(operator: any, message: string);
}
/**
 * Building threshold for list of operator IDs
 */
declare class Threshold {
    protected publicKey: any;
    protected privateKey: any;
    protected shares: Array<any>;
    static get DEFAULT_THRESHOLD_NUMBER(): number;
    /**
     * Receives list of operators IDs.
     *  len(operator IDs) := 3 * F + 1
     *
     * If F calculated from this formula is not integer number - it will raise exception.
     * Generate keys and return promise
     */
    create(privateKeyString: string, operatorIds: number[]): Promise<ISharesKeyPairs>;
}
export default Threshold;
