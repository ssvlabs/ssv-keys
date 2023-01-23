"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedVersion = void 0;
const supportedVersion = (value, message) => {
    const supportedVersions = ['2', '3'];
    if (supportedVersions.includes(value)) {
        return true;
    }
    else {
        return message || `Version ${value} is not supported`;
    }
};
exports.supportedVersion = supportedVersion;
//# sourceMappingURL=version-support.js.map