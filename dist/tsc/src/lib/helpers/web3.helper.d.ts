/// <reference types="node" />
import Web3 from 'web3';
export declare const web3: Web3;
/**
 * Encode with Web3 eth abi method any fields of shares array required for transaction.
 * @param encryptedShares
 * @param field
 */
export declare const abiEncode: (encryptedShares: any[], field?: string) => string[];
/**
 * This function converts a hexadecimal string into a Uint8Array.
 * It removes the prefix '0x' if present and maps each hexadecimal byte into a Uint8Array.
 *
 * @param {string} hex - The hexadecimal string input, it can start with '0x'.
 * @returns {Uint8Array} - It returns a Uint8Array, where each element in the array is a byte from the hexadecimal string.
 *
 */
export declare const hexToUint8Array: (hex: string) => Uint8Array;
/**
 * This function transforms an array of hexadecimal strings into a single Node.js Buffer.
 * It employs ethers.utils.arrayify to convert each hex string into a Uint8Array, flattens them into a single array, and converts that to a Buffer.
 *
 * @param {string[]} hexArr - An array of hexadecimal strings. Each string can represent bytes of arbitrary length. *
 * @returns {Buffer} - A Node.js Buffer that concatenates the bytes represented by the hexadecimal strings in the input array.
 *
 */
export declare const hexArrayToBytes: (hexArr: string[]) => Buffer;
export declare const buildSignature: (dataToSign: string, privateKey: string) => string;
export declare const sharesToBytes: (publicKeys: string[], privateKeys: string[]) => string;
