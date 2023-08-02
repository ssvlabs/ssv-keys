export default {
  arg1: '-opd',
  arg2: '--operators-distribution',
  options: {
    type: String,
    required: true,
    help: 'CSV with the operator distribution per cluster'
  },
  interactive: {
    options: {
      type: 'text',
    },
  }
};
