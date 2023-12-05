"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("../validators");
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
                try {
                    uniqueOperators[value] = (0, validators_1.operatorPublicKeyValidator)(value);
                    return true;
                }
                catch (e) {
                    return e.message;
                }
            }
        }
    }
};
//# sourceMappingURL=operator-public-keys.js.map