"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    arg1: '-on',
    arg2: '--owner-nonce',
    options: {
        type: Number,
        required: true,
        help: 'The validator registration nonce of the account (owner address) within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool.'
    },
    interactive: {
        options: {
            type: 'number',
            message: 'Please provide a validator registration nonce of the account (owner address)',
        }
    }
};
//# sourceMappingURL=owner-nonce.js.map