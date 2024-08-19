"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let index;
try {
    window.crypto;
    index = require('bls-eth-wasm/browser');
}
catch {
    index = require('bls-eth-wasm');
}
let crypto;
try {
    crypto = require('crypto');
    globalThis.crypto = crypto;
}
catch (err) {
    console.log('crypto support is disabled!');
}
exports.default = index;
//# sourceMappingURL=index.js.map