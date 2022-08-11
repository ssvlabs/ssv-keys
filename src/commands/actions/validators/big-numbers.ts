import Web3 from 'web3';

const web3 = new Web3();

export const bigNumberValidator = (value: string): string | boolean => {
  try {
    web3.utils.toBN(value).toString();
    return true;
  } catch (e) {
    return 'Token amount should be positive big number in Wei';
  }
};
