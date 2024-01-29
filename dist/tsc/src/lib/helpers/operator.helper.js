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
    // Extracting IDs and operatorKeys for error reporting
    const ids = operators.map(op => op.id);
    const operatorKeys = operators.map(op => op.operatorKey);
    // Validate and convert IDs to numbers for sorting
    const validatedOperators = operators.map((operator) => {
        const id = parseInt(operator.id, 10);
        if (isNaN(id)) {
            throw new operator_1.OperatorsCountsMismatchError(ids, operatorKeys, `Invalid operator ID: ${operator.id}`);
        }
        if (!operator.operatorKey) {
            throw new operator_1.OperatorsCountsMismatchError(ids, operatorKeys, `Operator key is missing for operator ID: ${id}`);
        }
        return { ...operator, id };
    });
    // Sort operators by ID
    validatedOperators.sort((a, b) => a.id - b.id);
    // Map to OperatorData objects
    return validatedOperators.map(operator => new OperatorData_1.OperatorData(operator));
};
exports.operatorSortedList = operatorSortedList;
//# sourceMappingURL=operator.helper.js.map