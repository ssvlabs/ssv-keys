import bls from '../../../BLS';
import Threshold, { IShares } from '../../../Threshold';

export interface Shares {
  privateKey: any,
  publicKey: any,
  signatures: any[],
  ids: any[],
}

export const sharesSignatures = async (_privateKey: string, operators: number[], message: string, isThreshold: boolean): Promise<Shares> => {
  if (!bls.deserializeHexStrToSecretKey) {
    await bls.init(bls.BLS12_381);
  }
  const threshold = await new Threshold().create(_privateKey, operators);
  const privateKey = bls.deserializeHexStrToSecretKey(_privateKey.replace('0x', ''));
  const publicKey = privateKey.getPublicKey();
  const signatures: any[] = [];
  const ids: any[] = [];
  const randomIndex: number = getRandomInt(4);

  threshold.shares.forEach((share: IShares, index: number) => {
    if (isThreshold && index === randomIndex) {
        return;
    }
    const sharePrivateKey = share.privateKey.substr(2);
    const shareBlsPrivateKey = bls.deserializeHexStrToSecretKey(sharePrivateKey);
    signatures.push(shareBlsPrivateKey.sign(message));
    ids.push(share.id);
  });
  return {
    privateKey,
    publicKey,
    signatures,
    ids,
  };
};

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}
