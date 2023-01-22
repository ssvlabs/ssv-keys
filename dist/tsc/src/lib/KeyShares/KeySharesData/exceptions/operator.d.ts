import { IOperatorData } from '../IOperatorData';
export declare class DuplicatedOperatorIdError extends Error {
    operator: IOperatorData;
    constructor(operator: IOperatorData, message: string);
}
export declare class DuplicatedOperatorPublicKeyError extends Error {
    operator: IOperatorData;
    constructor(operator: IOperatorData, message: string);
}
export declare class OperatorsCountsMismatchError extends Error {
    listOne: any[] | null | undefined;
    listTwo: any[] | null | undefined;
    constructor(propertyListOne: any[] | null | undefined, propertyListTwo: any[] | null | undefined, message: string);
}
export declare class OperatorPublicKeyError extends Error {
    publicKey: string;
    constructor(publicKey: string, message: string);
}
