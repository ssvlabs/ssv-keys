import { SSVKeysException } from './base';
export declare class KeySharesAbiDecodeError extends SSVKeysException {
    data: any;
    constructor(data: any, message: string);
}
