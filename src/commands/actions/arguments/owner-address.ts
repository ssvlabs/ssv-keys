export default {
  arg1: '-oa',
  arg2: '--owner-address',
  options: {
    type: String,
    required: true,
    help: 'Validator owner address?'
  },
  interactive: {
    options: {
      type: 'text',
      validate: (value: string): string | boolean => {
        if (!String(value).startsWith('0x')) {
          return 'Invalid owner address';
        }
        return true;
      }
    }
  }
};
