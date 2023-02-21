"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThresholdInvalidOperatorIdError = exports.ThresholdInvalidOperatorsLengthError = void 0;
const tslib_1 = require("tslib");
const BLS_1 = tslib_1.__importDefault(require("../BLS"));
const operator_ids_1 = require("../../commands/actions/validators/operator-ids");
class ThresholdInvalidOperatorsLengthError extends Error {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor(operators, message) {
        super(message);
        this.operators = operators;
    }
}
exports.ThresholdInvalidOperatorsLengthError = ThresholdInvalidOperatorsLengthError;
class ThresholdInvalidOperatorIdError extends Error {
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
    create(privateKey, operators) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Validation
            operators.map(operator => {
                if (!Number.isInteger(operator)) {
                    throw new ThresholdInvalidOperatorIdError(operator, `Operator must be integer. Got: ${operator}`);
                }
            });
            // Sort operators
            const sortedOperators = operators.sort((a, b) => a - b);
            const operatorsLength = sortedOperators.length;
            if (!(0, operator_ids_1.isOperatorsLengthValid)(operatorsLength)) {
                throw new ThresholdInvalidOperatorsLengthError(sortedOperators, 'Invalid operators amount. Enter an 3f+1 compatible amount of operator ids.');
            }
            yield BLS_1.default.init(BLS_1.default.BLS12_381);
            const msk = [];
            const mpk = [];
            // Master key Polynomial
            this.privateKey = BLS_1.default.deserializeHexStrToSecretKey(privateKey);
            this.publicKey = this.privateKey.getPublicKey();
            msk.push(this.privateKey);
            mpk.push(this.publicKey);
            const F = (operatorsLength - 1) / 3;
            // Construct poly
            for (let i = 1; i < operatorsLength - F; i += 1) {
                const sk = new BLS_1.default.SecretKey();
                sk.setByCSPRNG();
                msk.push(sk);
                const pk = sk.getPublicKey();
                mpk.push(pk);
            }
            // Evaluate shares - starting from 1 because 0 is master key
            for (const operatorId of sortedOperators) {
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
        });
    }
}
exports.default = Threshold;
//# sourceMappingURL=Threshold.js.map