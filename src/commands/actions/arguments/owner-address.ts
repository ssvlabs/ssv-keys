export default {
  arg1: '-oa',
  arg2: '--owner-address',
  options: {
    type: 'string',
    required: true,
    help: 'The cluster owner address (in the SSV contract)'
  },
  interactive: {
    options: {
      type: 'string',
      message: 'Please provide a cluster owner address',
    }
  }
};
