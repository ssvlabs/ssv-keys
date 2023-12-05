import { BaseCustomError } from './base';
import { IOperatorData } from '../KeyShares/KeySharesData/IOperatorData';
export declare class DuplicatedOperatorIdError extends BaseCustomError {
    operator: IOperatorData;
    constructor(operator: IOperatorData, message: string);
}
export declare class DuplicatedOperatorPublicKeyError extends BaseCustomError {
    operator: IOperatorData;
    constructor(operator: IOperatorData, message: string);
}
export declare class OperatorsCountsMismatchError extends BaseCustomError {
    listOne: any[] | null | undefined;
    listTwo: any[] | null | undefined;
    constructor(propertyListOne: any[] | null | undefined, propertyListTwo: any[] | null | undefined, message: string);
}
export declare class OperatorPublicKeyError extends BaseCustomError {
    operator: any;
    constructor(operator: {
        rsa: string;
        base64: string;
    }, message: string);
}
