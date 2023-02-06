export default {
  arg1: '-nu',
  arg2: '--node-url',
  options: {
    type: String,
    required: true,
    help: 'Eth1 node url?'
  },
  interactive: {
    options: {
      type: 'text',
    }
  }
};
