"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
exports.default = {
    arg1: '-kp',
    arg2: '--keystore-path',
    options: {
        required: false,
        type: String,
        help: 'The path to the folder containing validator keystore files'
    }
};
//# sourceMappingURL=keystore-path.js.map