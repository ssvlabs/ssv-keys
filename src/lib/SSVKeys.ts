import atob from 'atob';
import Web3 from 'web3';
import { encode } from 'js-base64';
import EthereumKeyStore from 'eth2-keystore-js';
import Threshold, { IShares, ISharesKeyPairs } from './Threshold';
import Encryption, { EncryptShare } from './Encryption/Encryption';

export class SSVKeys {
  static OPERATOR_FORMAT_BASE64 = 'base64';

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
   * @param operatorFormat
   */
  async encryptShares(operatorsPublicKeys: string[], shares: IShares[],
                      operatorFormat = SSVKeys.OPERATOR_FORMAT_BASE64): Promise<EncryptShare[]> {
    try {
      const decodedOperators = operatorsPublicKeys.map((operator: string) => {
        operator = atob(operator);
        return operatorFormat == SSVKeys.OPERATOR_FORMAT_BASE64
          ? String(encode(operator)) : operator;
      });
      return new Encryption(decodedOperators, shares).encrypt();
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
      return this.getWeb3().eth.abi.encodeParameter('string', Object(share)[field]);
    });
  }

  /**
   * Having keystore private key build final transaction payload for list of operators IDs from contract.
   *
   * Example:
   *
   *    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreFile(keystoreFilePath, keystorePassword);
   *    const encryptedShares = await ssvKeys.encryptShares(operatorsPublicKeys, shares);
   *    await ssvKeys.buildPayloadV2(...)
   *
   * @param privateKey
   * @param operatorsIds
   * @param encryptedShares
   * @param ssvAmount
   */
  async buildPayload(privateKey: string,
                     operatorsIds: number[],
                     encryptedShares: EncryptShare[],
                     ssvAmount: number | string
  ): Promise<any[]> {
    const threshold: ISharesKeyPairs = await this.createThreshold(privateKey, operatorsIds);
    const sharePublicKey: string[] = encryptedShares.map((share: EncryptShare) => share.publicKey);
    const sharePrivateKey: string[] = this.abiEncode(encryptedShares, 'privateKey');
    return [
      threshold.validatorPublicKey,
      `[${operatorsIds.join(',')}]`,
      sharePublicKey,
      sharePrivateKey,
      ssvAmount,
    ];
  }
}
