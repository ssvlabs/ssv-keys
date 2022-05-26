#!/usr/bin/env node
'use strict';
import { SSVKeysCommand } from './commands/SSVKeysCommand';

const command = new SSVKeysCommand(true);
command.execute().then(console.debug).catch(console.error);
