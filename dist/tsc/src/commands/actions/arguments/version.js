"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const version_support_1 = require("../validators/version-support");
exports.default = {
    arg1: '-v',
    arg2: '--version',
    options: {
        type: String,
        required: true,
        help: 'Payload version format [2 or 3]?'
    },
    interactive: {
        options: {
            type: 'text',
            validate: (value) => {
                if (!String(value).trim().length) {
                    return 'Invalid version format';
                }
                return (0, version_support_1.supportedVersion)(value, `Version ${value} is not supported`);
            }
        }
    }
};
//# sourceMappingURL=version.js.map