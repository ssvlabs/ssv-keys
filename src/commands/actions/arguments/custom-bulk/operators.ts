export default {
  arg1: '-op',
  arg2: '--operators',
  options: {
    type: String,
    required: true,
    help: 'CSV with all operators sand their Keys.'
  },
  interactive: {
    options: {
      type: 'text',
    },
  }
};
