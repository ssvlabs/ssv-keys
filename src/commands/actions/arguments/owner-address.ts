export default {
  arg1: '-oa',
  arg2: '--owner-address',
  options: {
    type: String,
    required: true,
    help: 'The cluster owner address (in the SSV contract)'
  },
  interactive: {
    options: {
      type: 'text',
      message: 'Please provide a cluster owner address',
    }
  }
};
