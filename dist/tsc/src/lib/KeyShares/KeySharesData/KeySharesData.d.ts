import { OperatorData } from './OperatorData';
import { IKeySharesData, IKeySharesPartitialData } from './IKeySharesData';
export declare class KeySharesData implements IKeySharesData {
    ownerNonce?: number | null;
    ownerAddress?: string | null;
    publicKey?: string | null;
    operators?: OperatorData[] | null;
    update(data: IKeySharesPartitialData): void;
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
