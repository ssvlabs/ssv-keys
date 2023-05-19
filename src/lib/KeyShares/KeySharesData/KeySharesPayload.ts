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
      shares: this._sharesToBytes(
        data.encryptedShares.map((share: EncryptShare) => share.publicKey),
        data.encryptedShares.map((share: EncryptShare) => share.privateKey)
      ),
      amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
      cluster: 'The latest cluster snapshot data, obtained using the cluster-scanner tool. If this is the cluster\'s 1st validator then use - {0,0,0,0,true}',
    };
    return this.readable;
  }
}
