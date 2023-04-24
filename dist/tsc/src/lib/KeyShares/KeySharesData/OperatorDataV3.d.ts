import { IOperatorData } from './IOperatorData';
export declare class OperatorDataV3 implements IOperatorData {
    id: number | undefined;
    publicKey: string | undefined;
    setData(data: any): any;
    /**
     * Validate operator ID and public key
     */
    validate(): void;
}
