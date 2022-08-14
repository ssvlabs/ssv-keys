import os from 'os';
import path from 'path';

export default {
  arg1: '-of',
  arg2: '--output-folder',
  options: {
    type: String,
    required: true,
    default: 'abi',
    help: 'Format of result: "abi" or "raw". By default: "abi"'
  },
  interactive: {
    options: {
      type: 'text',
      message: 'Select output folder for keyshares file',
      initial: `${path.join(os.homedir(), 'ssv-keys')}${path.sep}`
    }
  }
};
