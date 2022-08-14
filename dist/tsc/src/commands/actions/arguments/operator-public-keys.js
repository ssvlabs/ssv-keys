"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_1 = require("../validators/operator");
exports.default = {
    arg1: '-ok',
    arg2: '--operators-keys',
    options: {
        type: String,
        required: true,
        help: 'Comma-separated list of base64 operator keys. ' +
            'Require at least 4 operators'
    },
    interactive: {
        repeat: 4,
        options: {
            type: 'text',
            message: 'Operator base64 encoded public key',
            validate: operator_1.operatorValidator
        }
    }
};
//# sourceMappingURL=operator-public-keys.js.map