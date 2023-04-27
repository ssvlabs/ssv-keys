import { IKeySharesData } from './IKeySharesData';
import { OperatorDataV3 } from './OperatorDataV3';
export declare class KeySharesDataV3 implements IKeySharesData {
    publicKey?: string | null;
    operators?: OperatorDataV3[] | null;
    setData(data: any): void;
    /**
     * Do all possible validations.
     */
    validate(): Promise<any>;
    /**
     * Get the list of operators IDs.
     */
    get operatorIds(): number[];
    /**
     * Get the list of operators public keys.
     */
    get operatorPublicKeys(): string[];
}
