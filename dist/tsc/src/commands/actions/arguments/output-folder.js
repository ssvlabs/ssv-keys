"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const path_1 = tslib_1.__importDefault(require("path"));
exports.default = {
    arg1: '-of',
    arg2: '--output-folder',
    options: {
        type: String,
        required: true,
        default: 'abi',
        help: 'Format of result: "abi" or "raw". By default: "abi"'
    },
    interactive: {
        options: {
            type: 'text',
            message: 'Please provide a target path to generate the output to',
            initial: `${path_1.default.join(os_1.default.homedir(), 'ssv-keys')}${path_1.default.sep}`
        }
    }
};
//# sourceMappingURL=output-folder.js.map