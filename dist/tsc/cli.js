#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const SSVKeysCommand_1 = require("./commands/SSVKeysCommand");
const command = new SSVKeysCommand_1.SSVKeysCommand();
command.execute().then(console.debug).catch(console.error);
//# sourceMappingURL=cli.js.map