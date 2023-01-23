import Web3 from 'web3';
export declare const web3: Web3;
/**
 * Encode with Web3 eth abi method any fields of shares array required for transaction.
 * @param encryptedShares
 * @param field
 */
export declare const abiEncode: (encryptedShares: any[], field?: string) => string[];
