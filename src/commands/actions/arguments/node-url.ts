export default {
  arg1: '-nu',
  arg2: '--node-url',
  options: {
    type: String,
    required: true,
    help: 'Contract address?'
  },
  interactive: {
    options: {
      type: 'text',
    }
  }
};
