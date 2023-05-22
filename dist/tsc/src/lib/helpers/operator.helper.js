"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorSortedList = void 0;
const OperatorData_1 = require("../KeyShares/KeySharesData/OperatorData");
const operator_1 = require("../exceptions/operator");
/**
 * Sort operators input.
 * @param operators list
 */
const operatorSortedList = (operators) => {
    return operators
        .sort((a, b) => +a.id - +b.id)
        .map((operator) => {
        if (!operator.id || !operator.operatorKey) {
            throw new operator_1.OperatorsCountsMismatchError(operators, operators, 'Mismatch amount of operator ids and operator keys.');
        }
        return new OperatorData_1.OperatorData(operator);
    });
};
exports.operatorSortedList = operatorSortedList;
//# sourceMappingURL=operator.helper.js.map