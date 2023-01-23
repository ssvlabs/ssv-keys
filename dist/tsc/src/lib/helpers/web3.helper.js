"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abiEncode = exports.web3 = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
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
//# sourceMappingURL=web3.helper.js.map