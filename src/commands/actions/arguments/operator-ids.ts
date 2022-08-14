export default {
  arg1: '-oid',
  arg2: '--operators-ids',
  options: {
    type: String,
    required: true,
    help: 'Comma-separated list of operators IDs from the contract in the same sequence as you provided operators itself'
  },
  interactive: {
    repeat: 4,
    repeatWith: [
      '--operators-keys'
    ],
    options: {
      type: 'number',
      message: 'Operator ID from the contract',
      validate: (operatorId: number): boolean | string => {
        return !(Number.isInteger(operatorId) && operatorId > 0) ? 'Invalid operator ID format' : true;
      }
    }
  }
};
