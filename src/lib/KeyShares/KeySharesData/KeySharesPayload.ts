import * as web3Helper from '../../helpers/web3.helper';

import { IKeySharesPayload } from './IKeySharesPayload';
import { EncryptShare } from '../../Encryption/Encryption';

/**
 * Key Shares Payload
 */
export class KeySharesPayload implements IKeySharesPayload {
  public readable: any;

  private _sharesToBytes(publicKeys: string[], privateKeys: string[]) {
    const encryptedShares = [...privateKeys].map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
    const pkPsBytes = web3Helper.hexArrayToBytes([
      ...publicKeys,
      ...encryptedShares,
    ]);
    return `0x${pkPsBytes.toString('hex')}`;
  }

  build(data: any): any {
    this.readable = {
      publicKey: data.publicKey,
      operatorIds: data.operatorIds,
      sharesData: this._sharesToBytes(
        data.encryptedShares.map((share: EncryptShare) => share.publicKey),
        data.encryptedShares.map((share: EncryptShare) => share.privateKey)
      ),
    };
    return this.readable;
  }
}
