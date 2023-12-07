"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorPublicKeyError = exports.OperatorsCountsMismatchError = exports.DuplicatedOperatorPublicKeyError = exports.DuplicatedOperatorIdError = void 0;
const base_1 = require("./base");
class DuplicatedOperatorIdError extends base_1.SSVKeysException {
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.DuplicatedOperatorIdError = DuplicatedOperatorIdError;
class DuplicatedOperatorPublicKeyError extends base_1.SSVKeysException {
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.DuplicatedOperatorPublicKeyError = DuplicatedOperatorPublicKeyError;
class OperatorsCountsMismatchError extends base_1.SSVKeysException {
    constructor(propertyListOne, propertyListTwo, message) {
        super(message);
        this.listOne = propertyListOne;
        this.listTwo = propertyListTwo;
    }
}
exports.OperatorsCountsMismatchError = OperatorsCountsMismatchError;
class OperatorPublicKeyError extends base_1.SSVKeysException {
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.OperatorPublicKeyError = OperatorPublicKeyError;
//# sourceMappingURL=operator.js.map