import atob from 'atob';
import { encode } from 'js-base64';
import { KeyShares } from './KeyShares/KeyShares';
import Threshold, { IShares, ISharesKeyPairs } from './Threshold';
import EthereumKeyStore from './EthereumKeyStore/EthereumKeyStore';
import Encryption, { EncryptShare } from './Encryption/Encryption';
import { web3 } from './helpers/web3.helper';

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
  protected web3Instances: any = {};
  protected threshold: ISharesKeyPairs | undefined;

  public keySharesInstance: KeyShares;

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
      this.threshold = await threshold.create(privateKey, operators);
      return this.threshold;
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
          share.operatorPublicKey = web3.eth.abi.encodeParameter('string', share.operatorPublicKey);
          share.privateKey = web3.eth.abi.encodeParameter('string', share.privateKey);
        }
        return share;
      });
    } catch (error: any) {
      return error;
    }
  }

  /**
   * Build shares from private key, operator IDs and public keys
   * @param privateKey
   * @param operatorIds
   * @param operatorPublicKeys
   */
  async buildShares(privateKey: string, operatorIds: number[], operatorPublicKeys: string[]): Promise<EncryptShare[]> {
    const threshold = await this.createThreshold(privateKey, operatorIds);
    return this.encryptShares(operatorPublicKeys, threshold.shares);
  }

  /**
   * Getting threshold if it has been created before.
   */
  getThreshold()  {
    return this.threshold;
  }

  /**
   * Getting public key of validator
   */
  getValidatorPublicKey(): string {
    return this.getThreshold()?.validatorPublicKey || '';
  }

  /**
   * Build payload from encrypted shares, validator public key and operator IDs
   * @param validatorPublicKey
   * @param operatorsIds
   * @param encryptedShares
   * @param ssvAmount
   */
  buildPayload(validatorPublicKey: string, operatorsIds: number[], encryptedShares: EncryptShare[], ssvAmount: string | number): any {
    this.keyShares.generateContractPayload({
      validatorPublicKey,
      operatorsIds,
      encryptedShares,
      ssvAmount
    });

    return this.keyShares.payload;
  }

  /**
   * Build payload from keyshares file with operators and shares details inside.
   * If ssv amount is not provided - it will be taken from keyshares file if exist there or set to 0.
   * @param keyShares
   * @param ssvAmount
   */
  buildPayloadFromKeyShares(keyShares: KeyShares, ssvAmount?: string | number): any {
    const publicKeys = keyShares.data?.shares?.publicKeys || [];
    const validatorPublicKey = keyShares.data?.publicKey;
    const encryptedKeys = keyShares.data?.shares?.encryptedKeys || [];
    const operatorPublicKeys = keyShares.data?.operatorPublicKeys || [];

    if (publicKeys.length !== encryptedKeys.length
      || publicKeys.length !== operatorPublicKeys.length
      || encryptedKeys.length !== operatorPublicKeys.length
      || !encryptedKeys.length
      || !operatorPublicKeys.length
      || !publicKeys.length
    ) {
      throw Error('Operator public keys and shares public/encrypted keys length does not match or have zero length.');
    }
    this.keyShares.generateContractPayload({
      validatorPublicKey,
      operatorsIds: keyShares.data?.operators?.map((item: any) => item.id),
      encryptedShares: publicKeys.map((item: any, index: number) => ({
        publicKey: item,
        privateKey: encryptedKeys[index],
      })),
      ssvAmount: ssvAmount || keyShares.payload?.readable?.ssvAmount || 0,
    });

    return this.keyShares.payload;
  }
}
