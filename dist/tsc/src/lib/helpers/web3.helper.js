"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharesToBytes = exports.buildSignature = exports.hexArrayToBytes = exports.hexToUint8Array = exports.abiEncode = exports.web3 = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
const ethers = tslib_1.__importStar(require("ethers"));
const ethUtil = tslib_1.__importStar(require("ethereumjs-util"));
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
const buildSignature = (dataToSign, privateKey) => {
    const messageHash = ethUtil.keccak256(Buffer.from(dataToSign));
    const signature = ethUtil.ecsign(messageHash, Buffer.from((0, exports.hexToUint8Array)(privateKey)));
    const signatureHex = ethUtil.toRpcSig(signature.v, signature.r, signature.s);
    /*
    const publicKey = ethUtil.privateToPublic(Buffer.from(hexToUint8Array(signatureData.privateKey)));
    const address = ethUtil.publicToAddress(publicKey).toString('hex');
    const recoveredPublicKey = ethUtil.ecrecover(messageHash, signature.v, signature.r, signature.s);
    const recoveredAddress = ethUtil.publicToAddress(recoveredPublicKey).toString('hex');
  
    console.log("+++++", signatureHex);
    console.log(`0x${recoveredPublicKey.toString('hex')}`);
    console.log('address', address);
    console.log('rec address', recoveredAddress);
    console.log(metaData.publicKey);
    */
    // const signature = ethUtil.ecsign(messageHash, privateKey);
    return signatureHex;
};
exports.buildSignature = buildSignature;
const sharesToBytes = (publicKeys, privateKeys) => {
    const encryptedShares = [...privateKeys].map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
    const arrayPublicKeys = new Uint8Array(publicKeys.map(pk => [...ethers.utils.arrayify(pk)]).flat());
    const arrayEncryptedShares = new Uint8Array(encryptedShares.map(sh => [...ethers.utils.arrayify(sh)]).flat());
    // public keys hex encoded
    const pkHex = ethers.utils.hexlify(arrayPublicKeys);
    // length of the public keys (hex), hex encoded
    const pkHexLength = String(pkHex.length.toString(16)).padStart(4, '0');
    // join arrays
    const pkPsBytes = Buffer.concat([arrayPublicKeys, arrayEncryptedShares]);
    // add length of the public keys at the beginning
    // this is the variable that is sent to the contract as bytes, prefixed with 0x
    return `0x${pkHexLength}${pkPsBytes.toString('hex')}`;
};
exports.sharesToBytes = sharesToBytes;
//# sourceMappingURL=web3.helper.js.map