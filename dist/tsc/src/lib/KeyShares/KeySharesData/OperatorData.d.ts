import { IOperatorData } from './IOperatorData';
import { IOperator } from './IOperator';
export declare class OperatorData implements IOperatorData {
    id: number;
    operatorKey: string;
    constructor(data: IOperator);
    /**
     * Validate operator id and public key
     */
    validate(): void;
}
