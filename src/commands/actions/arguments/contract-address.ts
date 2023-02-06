export default {
  arg1: '-ca',
  arg2: '--contract-address',
  options: {
    type: String,
    required: true,
    help: 'SSV contract address?'
  },
  interactive: {
    options: {
      type: 'text',
      validate: (value: string): string | boolean => {
        if (!String(value).startsWith('0x')) {
          return 'Invalid contract address';
        }
        return true;
      }
    }
  }
};
