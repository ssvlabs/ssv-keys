import JSEncrypt from '../../JSEncrypt';
import * as operatorKeys from './RsaKeys';
import Threshold, { ISharesKeyPairs } from '../../Threshold';
import Encryption, { EncryptShare } from '../../Encryption/Encryption';

describe('Check Encryption shares', () => {
  it('should use raw public keys of operators and return encrypt shares without error', async () => {
    const privateKey = '0x12f1cf0ecf8086a7e1d84b3b77da48761664e3cdc73f165c644e7f0594f98bdd';
    const threshold: Threshold = new Threshold();
    const thresholdResult: ISharesKeyPairs = await threshold.create(privateKey, [9, 10, 11, 12]);
    const decodedOperatorPublicKeys = operatorKeys.publicKeys.map((operator: string) => Buffer.from(operator, 'base64').toString());
    const encryptedShares: EncryptShare[] = new Encryption(
      decodedOperatorPublicKeys,
      thresholdResult.shares
    ).encrypt();

    encryptedShares.forEach((share: EncryptShare, index: number) => {
      const decrypt = new JSEncrypt({});
      const privateKey = Buffer.from(operatorKeys.privateKeys[index], 'base64').toString();
      decrypt.setPrivateKey(privateKey);
      const decrypted = decrypt.decrypt(share.privateKey);
      expect(decrypted).toEqual(thresholdResult.shares[index].privateKey);
      // expect(encryptedShares[index].operatorPublicKey).toEqual(privateKey);
    });
  });
});
