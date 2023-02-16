"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorIdsValidator = exports.isOperatorsLengthValid = exports.OperatorIdsValidator = void 0;
class OperatorIdsValidator {
    constructor() {
        this.operatorsCount = 3;
    }
    setOperatorsCount(amount) {
        this.operatorsCount = amount;
    }
}
exports.OperatorIdsValidator = OperatorIdsValidator;
const isOperatorsLengthValid = (length) => {
    if (length < 4 || length > 13 || length % 3 != 1) {
        return false;
    }
    return true;
};
exports.isOperatorsLengthValid = isOperatorsLengthValid;
exports.operatorIdsValidator = new OperatorIdsValidator();
//# sourceMappingURL=operator-ids.js.map