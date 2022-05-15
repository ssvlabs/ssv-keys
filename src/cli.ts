#!/usr/bin/env node
'use strict';

require('jsdom-global/register');
import nodeCrypto from 'crypto';

declare global {
  interface Window { crypto: any; }
}

window.crypto = {
  getRandomValues: function(buffer: Buffer) {
    return nodeCrypto.randomFillSync(buffer);
  }
};

import { SSVKeysCommand } from './commands/SSVKeysCommand';

const command = new SSVKeysCommand();
command.execute().then(console.debug).catch(console.error);
