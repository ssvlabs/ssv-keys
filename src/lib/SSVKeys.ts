import atob from 'atob';
import Web3 from 'web3';
import { encode } from 'js-base64';
import EthereumKeyStore from 'eth2-keystore-js';
import Threshold, { IShares, ISharesKeyPairs } from './Threshold';
import Encryption, { EncryptShare } from './Encryption/Encryption';

export class SSVKeys {
  static SHARES_FORMAT_ABI = 'abi';

  protected web3Instances: any = {};

  getWeb3(nodeUrl = process.env.NODE_URL || ''): Web3 {
    if (!this.web3Instances[nodeUrl]) {
      this.web3Instances[nodeUrl] = new Web3(String(nodeUrl || ''))
    }
    return this.web3Instances[nodeUrl];
  }

  /**
   * Extract private key from keystore data using keystore password.
   * Generally can be used in browsers when the keystore data has been provided by browser.
   * @param data
   * @param password
   */
  async getPrivateKeyFromKeystoreData(data: string, password: string): Promise<string> {
    try {
      try {
        // Try to json parse the data before
        data = JSON.parse(data);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      const keyStore = new EthereumKeyStore(data);
      return await keyStore.getPrivateKey(password).then((privateKey: string) => privateKey);
    } catch (error: any) {
      return error;
    }
  }

  /**
   * Build threshold using private key for number of participants and failed participants.
   * @param privateKey
   * @param operators
   */
  async createThreshold(privateKey: string, operators: number[]): Promise<ISharesKeyPairs> {
    try {
      const threshold: Threshold = new Threshold();
      return threshold.create(privateKey, operators);
    } catch (error: any) {
      return error;
    }
  }

  /**
   * Encrypt operators shares using operators public keys.
   * @param operatorsPublicKeys
   * @param shares
   * @param sharesFormat
   */
  async encryptShares(operatorsPublicKeys: string[], shares: IShares[], sharesFormat = ''): Promise<EncryptShare[]> {
    try {
      const decodedOperators = operatorsPublicKeys.map((operator: string) => String(encode(atob(operator))));
      const encryptedShares = new Encryption(decodedOperators, shares).encrypt();
      return encryptedShares.map((share: EncryptShare) => {
        share.operatorPublicKey = encode(share.operatorPublicKey);
        if (sharesFormat === SSVKeys.SHARES_FORMAT_ABI) {
          share.operatorPublicKey = this.getWeb3().eth.abi.encodeParameter('string', share.operatorPublicKey);
          share.privateKey = this.getWeb3().eth.abi.encodeParameter('string', share.privateKey);
        }
        return share;
      });
    } catch (error: any) {
      return error;
    }
  }

  /**
   * Encode with Web3 eth abi method any fields of shares array required for transaction.
   * @param encryptedShares
   * @param field
   */
  abiEncode(encryptedShares: EncryptShare[], field: string): string[] {
    return encryptedShares.map((share: EncryptShare) => {
      const value = Object(share)[field];
      if (String(value).startsWith('0x')) {
        return value;
      }
      return this.getWeb3().eth.abi.encodeParameter('string', value);
    });
  }

  /**
   * Having keystore private key build final transaction payload for list of operators IDs from contract.
   *
   * Example:
   *
   *    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreFile(keystoreFilePath, keystorePassword);
   *    const encryptedShares = await ssvKeys.encryptShares(...);
   *    await ssvKeys.buildPayload(...)
   *
   * @param validatorPublicKey
   * @param operatorsIds
   * @param encryptedShares
   * @param ssvAmount
   */
  async buildPayload(validatorPublicKey: string,
                     operatorsIds: number[],
                     encryptedShares: EncryptShare[],
                     ssvAmount: number | string
  ): Promise<any[]> {
    const sharePublicKey: string[] = encryptedShares.map((share: EncryptShare) => share.publicKey);
    const sharePrivateKey: string[] = this.abiEncode(encryptedShares, 'privateKey');
    return [
      validatorPublicKey,
      operatorsIds.join(','),
      sharePublicKey,
      sharePrivateKey,
      ssvAmount,
    ];
  }
}
