import { bigNumberValidator } from '../validators/big-numbers';

export default {
  arg1: '-ssv',
  arg2: '--ssv-token-amount',
  options: {
    type: String,
    required: true,
    help: 'How much SSV would you like to deposit with the transaction(wei)? ' +
      'Calculated as: totalFee := allOperatorsFee + networkYearlyFees + liquidationCollateral. '
  },
  interactive: {
    options: {
      type: 'text',
      validate: (value: string): string | boolean => {
        return bigNumberValidator(value, 'Invalid ssv amount');
      }
    }
  }
};
