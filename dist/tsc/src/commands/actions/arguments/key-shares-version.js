"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_support_1 = require("../validators/version-support");
exports.default = {
    arg1: '-ksv',
    arg2: '--key-shares-version',
    options: {
        type: String,
        required: false,
        default: '3',
        help: 'The version of the tool output, e.g. use "2" for previous version?'
    },
    interactive: {
        options: {
            type: 'text',
            validate: (value) => {
                if (!value.trim().length) {
                    return 'Invalid version format';
                }
                return (0, version_support_1.supportedVersion)(value, `Version ${value} is not supported`);
            }
        }
    }
};
//# sourceMappingURL=key-shares-version.js.map