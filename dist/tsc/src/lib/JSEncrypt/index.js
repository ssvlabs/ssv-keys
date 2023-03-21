"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let index;
try {
    window.crypto;
    index = require('jsencrypt').JSEncrypt;
}
catch (_a) {
    index = require('./jsencrypt.bundle');
}
exports.default = index;
//# sourceMappingURL=index.js.map