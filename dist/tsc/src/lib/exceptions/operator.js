"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorPublicKeyError = exports.OperatorsCountsMismatchError = exports.DuplicatedOperatorPublicKeyError = exports.DuplicatedOperatorIdError = void 0;
class DuplicatedOperatorIdError extends Error {
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.DuplicatedOperatorIdError = DuplicatedOperatorIdError;
class DuplicatedOperatorPublicKeyError extends Error {
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.DuplicatedOperatorPublicKeyError = DuplicatedOperatorPublicKeyError;
class OperatorsCountsMismatchError extends Error {
    constructor(propertyListOne, propertyListTwo, message) {
        super(message);
        this.listOne = propertyListOne;
        this.listTwo = propertyListTwo;
    }
}
exports.OperatorsCountsMismatchError = OperatorsCountsMismatchError;
class OperatorPublicKeyError extends Error {
    constructor(operator, message) {
        super(message);
        this.operator = operator;
    }
}
exports.OperatorPublicKeyError = OperatorPublicKeyError;
//# sourceMappingURL=operator.js.map