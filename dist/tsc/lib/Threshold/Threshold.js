"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const bls = require('bls-eth-wasm/browser/bls');
/**
 * Building threshold for
 * Example of usage:
 *
 *  const threshold: Threshold = new Threshold();
 *  threshold.create('45df68ab75bb7ed1063b7615298e81c1ca1b0c362ef2e93937b7bba9d7c43a94').then((s) => {
 *    console.log(s);
 *  });
 */
class Threshold {
    constructor() {
        this.validatorShares = [];
    }
    static get DEFAULT_SHARES_NUMBER() {
        return 4;
    }
    static get DEFAULT_THRESHOLD_NUMBER() {
        return 3;
    }
    /**
     * Generate keys and return promise
     */
    create(privateKey, sharesNumber = Threshold.DEFAULT_SHARES_NUMBER, thresholdNumber = Threshold.DEFAULT_THRESHOLD_NUMBER) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    bls.init(bls.BLS12_381)
                        .then(() => {
                        const msk = [];
                        const mpk = [];
                        // Master key Polynomial
                        this.validatorPrivateKey = bls.deserializeHexStrToSecretKey(privateKey);
                        this.validatorPublicKey = this.validatorPrivateKey.getPublicKey();
                        msk.push(this.validatorPrivateKey);
                        mpk.push(this.validatorPublicKey);
                        // Construct poly
                        for (let i = 1; i < thresholdNumber; i += 1) {
                            const sk = new bls.SecretKey();
                            sk.setByCSPRNG();
                            msk.push(sk);
                            const pk = sk.getPublicKey();
                            mpk.push(pk);
                        }
                        // Evaluate shares - starting from 1 because 0 is master key
                        for (let i = 1; i <= sharesNumber; i += 1) {
                            const id = new bls.Id();
                            id.setInt(i);
                            const shareSecretKey = new bls.SecretKey();
                            shareSecretKey.share(msk, id);
                            const sharePublicKey = new bls.PublicKey();
                            sharePublicKey.share(mpk, id);
                            this.validatorShares.push({
                                privateKey: `0x${shareSecretKey.serializeToHexStr()}`,
                                publicKey: `0x${sharePublicKey.serializeToHexStr()}`,
                                id,
                            });
                        }
                        const response = {
                            validatorPrivateKey: `0x${this.validatorPrivateKey.serializeToHexStr()}`,
                            validatorPublicKey: `0x${this.validatorPublicKey.serializeToHexStr()}`,
                            shares: this.validatorShares,
                        };
                        resolve(response);
                    });
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.default = Threshold;
//# sourceMappingURL=Threshold.js.map