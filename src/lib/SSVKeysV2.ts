import { SSVKeys } from './SSVKeys';
import { ISharesKeyPairs } from './Threshold';
import { EncryptShare } from './Encryption/Encryption';

export class SSVKeysV2 extends SSVKeys {
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
   * @param tokenAmountGwei
   */
  async buildPayloadV2(privateKey: string,
                       operatorsIds: number[],
                       encryptedShares: EncryptShare[],
                       tokenAmountGwei: number
  ): Promise<any[]> {
    const threshold: ISharesKeyPairs = await this.createThreshold(privateKey);
    const sharePublicKey: string[] = encryptedShares.map((share: EncryptShare) => share.publicKey);
    const sharePrivateKey: string[] = this.abiEncode(encryptedShares, 'privateKey');
    return [
      threshold.validatorPublicKey,
      `[${operatorsIds.join(',')}]`,
      sharePublicKey,
      sharePrivateKey,
      tokenAmountGwei,
    ];
  }
}
