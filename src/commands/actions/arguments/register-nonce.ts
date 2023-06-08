export default {
  arg1: '-rn',
  arg2: '--register-nonce',
  options: {
    type: Number,
    required: true,
    help: 'The validator registration nonce of the account (owner address) within the SSV contract (increments after each validator registration), obtained using the ssv-scanner tool.'
  },
  interactive: {
    options: {
      type: 'number',
      message: 'Please provide a validator registration nonce, obtained using the ssv-scanner tool',
    }
  }
};
