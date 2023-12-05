import { BaseCustomError } from './base';
export declare class KeySharesAbiDecodeError extends BaseCustomError {
    data: any;
    constructor(data: any, message: string);
}
