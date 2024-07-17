import Web3 from 'web3';
import * as ethers from 'ethers';
import * as ethUtil from 'ethereumjs-util';

import bls from '../BLS';
import { SingleSharesSignatureInvalid } from '../exceptions/bls';

export const web3 = new Web3();

/**
 * Encode with Web3 eth abi method any fields of shares array required for transaction.
 * @param encryptedShares
 * @param field
 */
export const abiEncode = (encryptedShares: any[], field?: string): string[] => {
  return encryptedShares.map(share => {
    const value = field ? Object(share)[field] : share;
    if (String(value).startsWith('0x')) {
      return value;
    }
    return web3.eth.abi.encodeParameter('string', value);
  });
}

/**
 * This function converts a hexadecimal string into a Uint8Array.
 * It removes the prefix '0x' if present and maps each hexadecimal byte into a Uint8Array.
 *
 * @param {string} hex - The hexadecimal string input, it can start with '0x'.
 * @returns {Uint8Array} - It returns a Uint8Array, where each element in the array is a byte from the hexadecimal string.
 *
 */
export const hexToUint8Array = (hex: string) => {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  const length = hex.length / 2;
  const result = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const start = i * 2;
    const end = start + 2;
    const byte = parseInt(hex.slice(start, end), 16);
    result[i] = byte;
  }
  return result;
}

/**
 * This function transforms an array of hexadecimal strings into a single Node.js Buffer.
 * It employs ethers.utils.arrayify to convert each hex string into a Uint8Array, flattens them into a single array, and converts that to a Buffer.
 *
 * @param {string[]} hexArr - An array of hexadecimal strings. Each string can represent bytes of arbitrary length. *
 * @returns {Buffer} - A Node.js Buffer that concatenates the bytes represented by the hexadecimal strings in the input array.
 *
 */
export const hexArrayToBytes = (hexArr: string[]): Buffer => {
  const uint8Array = new Uint8Array(hexArr.map(item => [...ethers.utils.arrayify(item)]).flat());
  return Buffer.from(uint8Array);
}

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
export const buildSignature = async(dataToSign: string, privateKeyHex: string): Promise<string> => {
  if (!bls.deserializeHexStrToSecretKey) {
    await bls.init(bls.BLS12_381);
  }

  const privateKey = bls.deserializeHexStrToSecretKey(privateKeyHex.replace('0x', ''));

  const messageHash = ethUtil.keccak256(Buffer.from(dataToSign));
  const signature = privateKey.sign(new Uint8Array(messageHash));
  const signatureHex = signature.serializeToHexStr();
  return `0x${signatureHex}`;
}

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
export const validateSignature = async(signedData: string, signatureHex: string, publicKey: string): Promise<void> => {
  if (!bls.deserializeHexStrToSecretKey) {
    await bls.init(bls.BLS12_381);
  }

  const blsPublicKey = bls.deserializeHexStrToPublicKey(publicKey.replace('0x', ''));
  const signature = bls.deserializeHexStrToSignature(signatureHex.replace('0x', ''));

  const messageHash = ethUtil.keccak256(Buffer.from(signedData));

  if (!blsPublicKey.verify(signature, new Uint8Array(messageHash))) {
    throw new SingleSharesSignatureInvalid(signatureHex, 'Single shares signature is invalid');
  }
}

export const privateToPublicKey = async(privateKey: string): Promise<string> => {
  if (!bls.deserializeHexStrToSecretKey) {
    await bls.init(bls.BLS12_381);
  }
  return `0x${bls.deserializeHexStrToSecretKey(privateKey.replace('0x', '')).getPublicKey().serializeToHexStr()}`;
}

const toChecksumAddress = web3.utils.toChecksumAddress;

const decodeParameter = web3.eth.abi.decodeParameter;

export { toChecksumAddress, decodeParameter };
