import Web3 from 'web3';

export const web3 = new Web3();

/**
 * Encode with Web3 eth abi method any fields of shares array required for transaction.
 * @param encryptedShares
 * @param field
 */
export const abiEncode = (encryptedShares: any[], field?: string): string[] => {
  return encryptedShares.map(share => {
    const value = field ? Object(share)[field] : share;
    if (String(value).startsWith('0x')) {
      return value;
    }
    return web3.eth.abi.encodeParameter('string', value);
  });
}
