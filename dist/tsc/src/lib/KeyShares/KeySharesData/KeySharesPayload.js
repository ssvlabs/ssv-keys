"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesPayload = void 0;
const tslib_1 = require("tslib");
const ethers = tslib_1.__importStar(require("ethers"));
/**
 * Key Shares Payload
 */
class KeySharesPayload {
    decodeRSAShares(arr) {
        return arr.map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
    }
    sharesToBytes(publicKeys, privateKeys) {
        const encryptedShares = this.decodeRSAShares([...privateKeys]);
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
    }
    build(data) {
        this.readable = {
            publicKey: data.publicKey,
            operatorIds: data.operatorIds,
            shares: this.sharesToBytes(data.encryptedShares.map((share) => share.publicKey), data.encryptedShares.map((share) => share.privateKey)),
            amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
            cluster: 'The latest cluster snapshot data, obtained using the cluster-scanner tool. If this is the cluster\'s 1st validator then use - {0,0,0,0,true}',
        };
        return this.readable;
    }
}
exports.KeySharesPayload = KeySharesPayload;
//# sourceMappingURL=KeySharesPayload.js.map