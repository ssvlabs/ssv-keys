"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSignature = exports.buildSignature = exports.hexArrayToBytes = exports.hexToUint8Array = exports.abiEncode = exports.web3 = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const ethers = tslib_1.__importStar(require("ethers"));
const ethUtil = tslib_1.__importStar(require("ethereumjs-util"));
const BLS_1 = tslib_1.__importDefault(require("../BLS"));
const bls_1 = require("../exceptions/bls");
exports.web3 = new web3_1.default();
/**
 * Encode with Web3 eth abi method any fields of shares array required for transaction.
 * @param encryptedShares
 * @param field
 */
const abiEncode = (encryptedShares, field) => {
    return encryptedShares.map(share => {
        const value = field ? Object(share)[field] : share;
        if (String(value).startsWith('0x')) {
            return value;
        }
        return exports.web3.eth.abi.encodeParameter('string', value);
    });
};
exports.abiEncode = abiEncode;
/**
 * This function converts a hexadecimal string into a Uint8Array.
 * It removes the prefix '0x' if present and maps each hexadecimal byte into a Uint8Array.
 *
 * @param {string} hex - The hexadecimal string input, it can start with '0x'.
 * @returns {Uint8Array} - It returns a Uint8Array, where each element in the array is a byte from the hexadecimal string.
 *
 */
const hexToUint8Array = (hex) => {
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
};
exports.hexToUint8Array = hexToUint8Array;
/**
 * This function transforms an array of hexadecimal strings into a single Node.js Buffer.
 * It employs ethers.utils.arrayify to convert each hex string into a Uint8Array, flattens them into a single array, and converts that to a Buffer.
 *
 * @param {string[]} hexArr - An array of hexadecimal strings. Each string can represent bytes of arbitrary length. *
 * @returns {Buffer} - A Node.js Buffer that concatenates the bytes represented by the hexadecimal strings in the input array.
 *
 */
const hexArrayToBytes = (hexArr) => {
    const uint8Array = new Uint8Array(hexArr.map(item => [...ethers.utils.arrayify(item)]).flat());
    return Buffer.from(uint8Array);
};
exports.hexArrayToBytes = hexArrayToBytes;
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
const buildSignature = (dataToSign, privateKeyHex) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!BLS_1.default.deserializeHexStrToSecretKey) {
        yield BLS_1.default.init(BLS_1.default.BLS12_381);
    }
    const privateKey = BLS_1.default.deserializeHexStrToSecretKey(privateKeyHex.replace('0x', ''));
    const messageHash = ethUtil.keccak256(Buffer.from(dataToSign));
    const signature = privateKey.sign(new Uint8Array(messageHash));
    const signatureHex = signature.serializeToHexStr();
    return `0x${signatureHex}`;
});
exports.buildSignature = buildSignature;
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
const validateSignature = (signedData, signatureHex, publicKey) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (!BLS_1.default.deserializeHexStrToSecretKey) {
        yield BLS_1.default.init(BLS_1.default.BLS12_381);
    }
    const blsPublicKey = BLS_1.default.deserializeHexStrToPublicKey(publicKey.replace('0x', ''));
    const signature = BLS_1.default.deserializeHexStrToSignature(signatureHex.replace('0x', ''));
    const messageHash = ethUtil.keccak256(Buffer.from(signedData));
    if (!blsPublicKey.verify(signature, new Uint8Array(messageHash))) {
        throw new bls_1.SingleSharesSignatureInvalid(signatureHex, 'Single shares signature is invalid');
    }
});
exports.validateSignature = validateSignature;
//# sourceMappingURL=web3.helper.js.map