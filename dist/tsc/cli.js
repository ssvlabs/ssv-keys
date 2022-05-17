#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require('jsdom-global/register');
const crypto_1 = tslib_1.__importDefault(require("crypto"));
window.crypto = {
    getRandomValues: function (buffer) {
        return crypto_1.default.randomFillSync(buffer);
    }
};
const SSVKeysCommand_1 = require("./commands/SSVKeysCommand");
const command = new SSVKeysCommand_1.SSVKeysCommand();
command.execute().then(console.debug).catch(console.error);
//# sourceMappingURL=cli.js.map