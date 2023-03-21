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
    V2: 'v2',
    V3: 'v3',
  };

  protected version: string;
  protected threshold: ISharesKeyPairs | undefined;

  public keySharesInstance: KeyShares;
  public privateKey: any;
  public publicKey: any;

  constructor(ver: string) {
    if (!Object.values(SSVKeys.VERSION).includes(ver)) {
      throw Error ('Version is not supported');
    }

    this.version = ver;
    this.keySharesInstance = new KeyShares({ version: this.version });
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
    });
  }

  /**
   * Build payload from keyshares file with operators and shares details inside.
   * @param keyShares
   */
  async buildPayloadFromKeyShares(keyShares: KeyShares): Promise<any> {
    const publicKeys = keyShares.data?.shares?.publicKeys || [];
    const publicKey = keyShares.data?.publicKey;
    const encryptedKeys = keyShares.data?.shares?.encryptedKeys || [];
    const operatorPublicKeys = keyShares.data.operators?.map((item: any) => item.publicKey) as string[];
    const operatorIds = keyShares.data.operators?.map((item: any) => item.id) as number[];

    const operators = operatorIds
      .map((id, index) => ({ id, publicKey: operatorPublicKeys[index]}))
      .sort((a: any, b: any) => +a.id - +b.id);

      if (publicKeys.length !== encryptedKeys.length
      || publicKeys.length !== operatorPublicKeys.length
      || encryptedKeys.length !== operatorPublicKeys.length
      || !encryptedKeys.length
      || !operatorPublicKeys.length
      || !publicKeys.length
    ) {
      throw Error('Operator public keys and shares public/encrypted keys length does not match or have zero length.');
    }

    return this.keyShares.generateContractPayload({
      publicKey,
      operatorIds: operators.map(item => item.id),
      encryptedShares: publicKeys.map((item: any, index: number) => ({
        publicKey: item,
        privateKey: encryptedKeys[index],
      })),
    });
  }
}
