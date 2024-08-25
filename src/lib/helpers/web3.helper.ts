import * as ethUtil from 'ethereumjs-util';

import bls from '../BLS';
import { SingleSharesSignatureInvalid } from '../exceptions/bls';

type Bytes = ArrayLike<number>;

type BytesLike = Bytes | string;

type DataOptions = {
  allowMissingPrefix?: boolean;
  hexPad?: "left" | "right" | null;
};

interface Hexable {
  toHexString(): string;
}

function isHexString(value: any, length?: number): boolean {
  if (typeof(value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  return !(length && value.length !== 2 + 2 * length);
}

function isHexable(value: any): value is Hexable {
  return !!(value.toHexString);
}

function isInteger(value: number) {
  return (typeof(value) === 'number' && value == value && (value % 1) === 0);
}

export function isBytes(value: any): value is Bytes {
  if (value == null) { return false; }

  if (value.constructor === Uint8Array) { return true; }
  if (typeof(value) === "string") { return false; }
  if (!isInteger(value.length) || value.length < 0) { return false; }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (!isInteger(v) || v < 0 || v >= 256) { return false; }
  }
  return true;
}

export function arrayify(value: BytesLike | Hexable | number, options?: DataOptions): Uint8Array {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    const result = [];
    while (value) {
      result.unshift(value & 0xff);
      value = parseInt(String(value / 256));
    }
    if (result.length === 0) { result.push(0); }

    return new Uint8Array(result);
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { value = value.toHexString(); }

  if (isHexString(value)) {
    let hex = (<string>value).substring(2);
    if (hex.length % 2) {
      if (options.hexPad === "left") {
        hex = "0" + hex;
      } else if (options.hexPad === "right") {
        hex += "0";
      }
    }

    const result = [];
    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return new Uint8Array(result);
  }

  if (isBytes(value)) {
    return new Uint8Array(value);
  }

  return new Uint8Array();
}

const HexCharacters = "0123456789abcdef";

export function hexlify(value: BytesLike | Hexable | number | bigint, options?: DataOptions): string {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    let hex = "";
    while (value) {
      hex = HexCharacters[value & 0xf] + hex;
      value = Math.floor(value / 16);
    }

    if (hex.length) {
      if (hex.length % 2) { hex = "0" + hex; }
      return "0x" + hex;
    }

    return "0x00";
  }

  if (typeof(value) === "bigint") {
    value = value.toString(16);
    if (value.length % 2) { return ("0x0" + value); }
    return "0x" + value;
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { return value.toHexString(); }

  if (isHexString(value)) {
    if ((<string>value).length % 2) {
      if (options.hexPad === "left") {
        value = "0x0" + (<string>value).substring(2);
      } else if (options.hexPad === "right") {
        value += "0";
      }
    }
    return (<string>value).toLowerCase();
  }

  if (isBytes(value)) {
    let result = "0x";
    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
  }

  return '';
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
  const uint8Array = new Uint8Array(hexArr.map(item => [...arrayify(item)]).flat());
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

const toChecksumAddress = ethUtil.toChecksumAddress;

function decodeHexString(hex: any) {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  return hex;
}

function hexToBytes(hex: any) {
  hex = decodeHexString(hex);
  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substring(i, 2), 16));
  }
  return bytes;
}

function decodeUint256(hex: any) {
  const bytes = hexToBytes(hex);
  let result = BigInt(0);
  for (let i = 0; i < bytes.length; i++) {
    result = (result << BigInt(8)) + BigInt(bytes[i]);
  }
  return result.toString();
}

function decodeString(hex: any) {
  const length = parseInt(decodeUint256(hex.slice(64, 128)), 10);
  const stringHex = hex.slice(128, 128 + length * 2);

  let str = '';
  for (let i = 0; i < stringHex.length; i += 2) {
    const code = parseInt(stringHex.substring(i, 2), 16);
    str += String.fromCharCode(code);
  }
  return str;
}

function decodeParameter(type: string, hex: any) {
  switch (type) {
    case 'string':
      return decodeString(hex);
    // Add more cases for other types as needed
    default:
      throw new Error('Unsupported or unknown type: ' + type);
  }
}

export { toChecksumAddress, decodeParameter };

