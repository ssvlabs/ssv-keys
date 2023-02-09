"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    arg1: '-oa',
    arg2: '--owner-address',
    options: {
        type: String,
        required: true,
        help: 'Validator owner address?'
    },
    interactive: {
        options: {
            type: 'text',
            validate: (value) => {
                if (!String(value).startsWith('0x')) {
                    return 'Invalid owner address';
                }
                return true;
            }
        }
    }
};
//# sourceMappingURL=owner-address.js.map