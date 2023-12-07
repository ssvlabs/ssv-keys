import { SSVKeysException } from './base';
import { IOperatorData } from '../KeyShares/KeySharesData/IOperatorData';
export declare class DuplicatedOperatorIdError extends SSVKeysException {
    operator: IOperatorData;
    constructor(operator: IOperatorData, message: string);
}
export declare class DuplicatedOperatorPublicKeyError extends SSVKeysException {
    operator: IOperatorData;
    constructor(operator: IOperatorData, message: string);
}
export declare class OperatorsCountsMismatchError extends SSVKeysException {
    listOne: any[] | null | undefined;
    listTwo: any[] | null | undefined;
    constructor(propertyListOne: any[] | null | undefined, propertyListTwo: any[] | null | undefined, message: string);
}
export declare class OperatorPublicKeyError extends SSVKeysException {
    operator: any;
    constructor(operator: {
        rsa: string;
        base64: string;
    }, message: string);
}
