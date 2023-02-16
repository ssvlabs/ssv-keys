"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operator_ids_1 = require("../validators/operator-ids");
exports.default = {
    arg1: '-oa',
    arg2: '--operators-amount',
    options: {
        type: Number,
        required: true,
        default: 4,
        help: `Enter operators amount, 4, 7, 10 or 13. Default: 4`
    },
    interactive: {
        options: {
            type: 'number',
            message: 'Enter operators amount:',
            validate: (value) => {
                if (!(0, operator_ids_1.isOperatorsLengthValid)(value)) {
                    return 'Invalid operators amount.';
                }
                operator_ids_1.operatorIdsValidator.setOperatorsCount(value);
                return true;
            }
        }
    }
};
//# sourceMappingURL=operators-count.js.map