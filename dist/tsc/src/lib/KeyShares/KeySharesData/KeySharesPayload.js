"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesPayload = void 0;
const tslib_1 = require("tslib");
const web3Helper = tslib_1.__importStar(require("../../helpers/web3.helper"));
/**
 * Key Shares Payload
 */
class KeySharesPayload {
    _sharesToBytes(publicKeys, privateKeys) {
        const encryptedShares = [...privateKeys].map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
        const pkPsBytes = web3Helper.hexArrayToBytes([
            ...publicKeys,
            ...encryptedShares,
        ]);
        return `0x${pkPsBytes.toString('hex')}`;
    }
    build(data) {
        this.readable = {
            publicKey: data.publicKey,
            operatorIds: data.operatorIds,
            sharesData: this._sharesToBytes(data.encryptedShares.map((share) => share.publicKey), data.encryptedShares.map((share) => share.privateKey)),
            amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
            cluster: 'The latest cluster snapshot data, obtained using the cluster-scanner tool. If this is the cluster\'s 1st validator then use - {0,0,0,0,true}',
        };
        return this.readable;
    }
}
exports.KeySharesPayload = KeySharesPayload;
//# sourceMappingURL=KeySharesPayload.js.map