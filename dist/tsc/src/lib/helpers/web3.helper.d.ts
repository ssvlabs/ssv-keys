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
/**
 * Asynchronously creates a BLS signature for given data using a private key.
 *
 * @param {string} dataToSign - The data to be signed.
 * @param {string} privateKeyHex - Hexadecimal representation of the private key.
 * @returns {Promise<string>} - A promise that resolves to the BLS signature in hexadecimal format.
 *
 * The function initializes the BLS library if needed, deserializes the private key from a hexadecimal string,
 * computes the Keccak-256 hash of the data, signs the hashed data using the deserialized private key,
 * and returns the signature in hexadecimal format, prefixed with '0x'.
 */
export declare const buildSignature: (dataToSign: string, privateKeyHex: string) => Promise<string>;
/**
 * Asynchronously validates a BLS signature for given signed data.
 *
 * @param {string} signedData - Data that has been signed.
 * @param {string} signatureHex - Hexadecimal representation of the BLS signature.
 * @param {string} publicKey - Hexadecimal representation of the public key.
 * @throws {SingleSharesSignatureInvalid} - Throws an error if the signature is invalid.
 * @returns {Promise<void>} - Resolves when the signature is successfully verified.
 *
 * The function initializes the BLS library if needed, deserializes the public key and signature from hexadecimal strings,
 * computes the Keccak-256 hash of the signed data, and verifies the signature using the deserialized public key.
 */
export declare const validateSignature: (signedData: string, signatureHex: string, publicKey: string) => Promise<void>;
export declare const privateToPublicKey: (privateKey: string) => Promise<string>;
