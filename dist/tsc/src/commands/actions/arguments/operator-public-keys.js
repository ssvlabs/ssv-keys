"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("../validators/operator");
const uniqueOperators = {};
exports.default = {
    arg1: '-oks',
    arg2: '--operator-keys',
    options: {
        type: String,
        required: true,
        help: 'Comma-separated list of operator keys (same sequence as operator ids). The amount must be 3f+1 compatible'
    },
    interactive: {
        options: {
            type: 'text',
            message: 'Enter operator public key for {{index}} operator',
            validate: (value) => {
                if (uniqueOperators[value]) {
                    return 'This operator already used';
                }
                const returnValue = (0, operator_1.operatorPublicKeyValidator)(value);
                if (returnValue === true) {
                    uniqueOperators[value] = true;
                }
                return returnValue;
            }
        }
    }
};
//# sourceMappingURL=operator-public-keys.js.map