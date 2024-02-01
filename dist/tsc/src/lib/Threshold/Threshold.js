"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThresholdInvalidOperatorIdError = exports.ThresholdInvalidOperatorsLengthError = void 0;
const tslib_1 = require("tslib");
const BLS_1 = tslib_1.__importDefault(require("../BLS"));
const base_1 = require("../exceptions/base");
const keystore_1 = require("../exceptions/keystore");
const validators_1 = require("../../commands/actions/validators");
class ThresholdInvalidOperatorsLengthError extends base_1.SSVKeysException {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(operators, message) {
        super(message);
        this.operators = operators;
    }
}
exports.ThresholdInvalidOperatorsLengthError = ThresholdInvalidOperatorsLengthError;
class ThresholdInvalidOperatorIdError extends base_1.SSVKeysException {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.ThresholdInvalidOperatorIdError = ThresholdInvalidOperatorIdError;
/**
 * Building threshold for list of operator IDs
 */
class Threshold {
    constructor() {
        this.shares = [];
    }
    static get DEFAULT_THRESHOLD_NUMBER() {
        return 3;
    }
    /**
     * Receives list of operators IDs.
     *  len(operator IDs) := 3 * F + 1
     *
     * If F calculated from this formula is not integer number - it will raise exception.
     * Generate keys and return promise
     */
    async create(privateKeyString, operatorIds) {
        if (!privateKeyString.startsWith('0x')) {
            throw new keystore_1.PrivateKeyFormatError(privateKeyString, 'The private key must be provided in the 0x format.');
        }
        // Validation
        operatorIds.map(operatorId => {
            if (!Number.isInteger(operatorId)) {
                throw new ThresholdInvalidOperatorIdError(operatorId, `Operator must be integer. Got: ${operatorId}`);
            }
        });
        if (!(0, validators_1.isOperatorsLengthValid)(operatorIds.length)) {
            throw new ThresholdInvalidOperatorsLengthError(operatorIds, 'Invalid operators amount. Enter an 3f+1 compatible amount of operator ids.');
        }
        const msk = [];
        const mpk = [];
        if (!BLS_1.default.deserializeHexStrToSecretKey) {
            await BLS_1.default.init(BLS_1.default.BLS12_381);
        }
        // Master key Polynomial
        this.privateKey = BLS_1.default.deserializeHexStrToSecretKey(privateKeyString.replace('0x', ''));
        this.publicKey = this.privateKey.getPublicKey();
        msk.push(this.privateKey);
        mpk.push(this.publicKey);
        const F = (operatorIds.length - 1) / 3;
        // Construct poly
        for (let i = 1; i < operatorIds.length - F; i += 1) {
            const sk = new BLS_1.default.SecretKey();
            sk.setByCSPRNG();
            msk.push(sk);
            const pk = sk.getPublicKey();
            mpk.push(pk);
        }
        // Evaluate shares - starting from 1 because 0 is master key
        for (const operatorId of operatorIds) {
            const id = new BLS_1.default.Id();
            id.setInt(operatorId);
            const shareSecretKey = new BLS_1.default.SecretKey();
            shareSecretKey.share(msk, id);
            const sharePublicKey = new BLS_1.default.PublicKey();
            sharePublicKey.share(mpk, id);
            this.shares.push({
                privateKey: `0x${shareSecretKey.serializeToHexStr()}`,
                publicKey: `0x${sharePublicKey.serializeToHexStr()}`,
                id,
            });
        }
        const response = {
            privateKey: `0x${this.privateKey.serializeToHexStr()}`,
            publicKey: `0x${this.publicKey.serializeToHexStr()}`,
            shares: this.shares,
        };
        return response;
    }
}
exports.default = Threshold;
//# sourceMappingURL=Threshold.js.map