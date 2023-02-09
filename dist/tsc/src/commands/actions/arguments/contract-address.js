"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    arg1: '-ca',
    arg2: '--contract-address',
    options: {
        type: String,
        required: true,
        help: 'Contract address?'
    },
    interactive: {
        options: {
            type: 'text',
            validate: (value) => {
                if (!String(value).startsWith('0x')) {
                    return 'Invalid contract address';
                }
                return true;
            }
        }
    }
};
//# sourceMappingURL=contract-address.js.map