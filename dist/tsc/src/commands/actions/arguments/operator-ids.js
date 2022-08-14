"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    arg1: '-oid',
    arg2: '--operators-ids',
    options: {
        type: String,
        required: true,
        help: 'Comma-separated list of operators IDs from the contract in the same sequence as you provided operators itself'
    },
    interactive: {
        repeat: 4,
        repeatWith: [
            '--operators-keys'
        ],
        options: {
            type: 'number',
            message: 'Enter operator ID for operator',
            validate: (operatorId) => {
                return !(Number.isInteger(operatorId) && operatorId > 0) ? 'Invalid operator ID format' : true;
            }
        }
    }
};
//# sourceMappingURL=operator-ids.js.map