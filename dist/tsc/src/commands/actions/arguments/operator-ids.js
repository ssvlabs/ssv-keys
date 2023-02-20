"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uniqueOperatorIds = {};
exports.default = {
    arg1: '-oids',
    arg2: '--operator-ids',
    options: {
        type: String,
        required: true,
        help: 'Comma-separated list of operator IDs'
    },
    interactive: {
        repeat: 'Input another operator?',
        repeatWith: [
            '--operator-keys'
        ],
        options: {
            type: 'number',
            message: 'Enter operator ID for {{index}} operator',
            validate: (operatorId) => {
                if (uniqueOperatorIds[operatorId]) {
                    return 'This operator ID is already used';
                }
                const returnValue = !(Number.isInteger(operatorId) && operatorId > 0) ? 'Invalid operator ID format' : true;
                if (returnValue === true) {
                    uniqueOperatorIds[operatorId] = true;
                }
                return returnValue;
            }
        }
    }
};
//# sourceMappingURL=operator-ids.js.map