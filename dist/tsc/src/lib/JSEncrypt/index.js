"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let index;
try {
    window.crypto;
    index = require('jsencrypt').JSEncrypt;
}
catch {
    index = require('./jsencrypt.bundle');
}
exports.default = index;
//# sourceMappingURL=index.js.map