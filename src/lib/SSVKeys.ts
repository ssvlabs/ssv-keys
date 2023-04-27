// import atob from 'atob';
import bls from './BLS';
import { KeyShares } from './KeyShares/KeyShares';
import Threshold, { IShares, ISharesKeyPairs } from './Threshold';
import EthereumKeyStore from './EthereumKeyStore/EthereumKeyStore';
import Encryption, { EncryptShare } from './Encryption/Encryption';

export interface IPayloadMetaData {
  publicKey: string,
  operatorIds: number[],
  encryptedShares: EncryptShare[],
}

/**
 * SSVKeys class provides high-level methods to easily work with entire flow:
 *  - getting private key from keystore file using password
 *  - creating shares threshold
 *  - creating final shares
 *  - building final payload which is ready to be used in web3 transaction
 */
export class SSVKeys {
  static SHARES_FORMAT_ABI = 'abi';
  static VERSION = {
    V3: 'v3',
  };

  protected version: string;
  protected threshold: ISharesKeyPairs | undefined;

  public keySharesInstance: KeyShares;
  public privateKey: any;
  public publicKey: any;

  constructor() {
    this.version = SSVKeys.VERSION.V3;
    this.keySharesInstance = new KeyShares();
  }

  get keyShares(): KeyShares {
    return this.keySharesInstance;
  }
  /**
   * Extract private key from keystore data using keystore password.
   * Generally can be used in browsers when the keystore data has been provided by browser.
   * @param data
   * @param password
   */
  async getPrivateKeyFromKeystoreData(data: string, password: string): Promise<string> {
    try {
      const privateKey = await new EthereumKeyStore(data).getPrivateKey(password);

      await bls.init(bls.BLS12_381);
      this.privateKey = `0x${bls.deserializeHexStrToSecretKey(privateKey).serializeToHexStr()}`;
      this.publicKey = `0x${bls.deserializeHexStrToSecretKey(privateKey).getPublicKey().serializeToHexStr()}`;
      return privateKey;
    } catch (error: any) {
      return error;
    }
  }

  /**
   * Build threshold using private key for number of participants and failed participants.
   * @param privateKey
   * @param operators
   */
  async createThreshold(privateKey: string, operatorIds: number[]): Promise<ISharesKeyPairs> {
    this.threshold = await new Threshold().create(privateKey, operatorIds);
    return this.threshold;
  }

  /**
   * Encrypt operators shares using operators public keys.
   * @param operatorsPublicKeys
   * @param shares
   * @param sharesFormat
   */
  async encryptShares(operatorsPublicKeys: string[], shares: IShares[]): Promise<EncryptShare[]> {
    const decodedOperatorPublicKeys = operatorsPublicKeys.map((operator: string) => Buffer.from(operator, 'base64').toString());
    const encryptedShares = new Encryption(decodedOperatorPublicKeys, shares).encrypt();
    return encryptedShares;
  }

  /**
   * Build shares from private key, operator IDs and public keys
   * @param privateKey
   * @param operatorIds
   * @param operatorPublicKeys
   */
  async buildShares(privateKey: string, operatorIds: number[], operatorPublicKeys: string[]): Promise<EncryptShare[]> {
    if (operatorIds.length !== operatorPublicKeys.length) {
      throw Error('Mismatch amount of operator ids and operator keys.');
    }
    const operators = operatorIds
      .map((id, index) => ({ id, publicKey: operatorPublicKeys[index]}))
      .sort((a: any, b: any) => +a.id - +b.id);

    const threshold = await this.createThreshold(privateKey, operators.map(item => item.id));
    return this.encryptShares(operators.map(item => item.publicKey), threshold.shares);
  }

  /**
   * Getting threshold if it has been created before.
   */
  getThreshold()  {
    return this.threshold;
  }

  /**
   * Build payload from encrypted shares, validator public key and operator IDs
   * @param publicKey
   * @param operatorIds
   * @param encryptedShares
   */
  async buildPayload(metaData: IPayloadMetaData): Promise<any> {
    return this.keyShares.generateContractPayload({
      publicKey: metaData.publicKey,
      operatorIds: [...metaData.operatorIds].sort((a: number, b: number) => a - b),
      encryptedShares: metaData.encryptedShares,
    }).readable;
  }

}
