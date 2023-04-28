import _ from 'underscore';
import * as ethers from 'ethers';

import { IsObject, IsOptional } from 'class-validator';
import { IKeySharesPayload } from './IKeySharesPayload';
import { EncryptShare } from '../../Encryption/Encryption';

/**
 * Key Shares Payload v2.
 */
export class KeySharesPayloadV3 implements IKeySharesPayload {
  static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
  static PAYLOAD_INDEX_OPERATOR_IDS = 1;
  static PAYLOAD_INDEX_SHARES_KEYS = 2;

  @IsOptional()
  @IsObject()
  public readable?: any = null;

  private decodeRSAShares(arr: string[]) {
    return arr.map(item => ('0x' + Buffer.from(item, 'base64').toString('hex')));
  }

  private sharesToBytes(publicKeys: string[], privateKeys: string[]): string {
    const encryptedShares = this.decodeRSAShares([...privateKeys]);
    const arrayPublicKeys = Buffer.from(publicKeys.map(pk => [...ethers.utils.arrayify(pk)]).flat());
    const arrayEncryptedShares = Buffer.from(encryptedShares.map(sh => [...ethers.utils.arrayify(sh)]).flat());

    // public keys hex encoded
    const pkHex = ethers.utils.hexlify(arrayPublicKeys);
    // length of the public keys (hex), hex encoded
    const pkHexLength = String(pkHex.length.toString(16)).padStart(4, '0');

    // join arrays
    const pkPsBytes = Buffer.concat([arrayPublicKeys, arrayEncryptedShares]);

    // add length of the public keys at the beginning
    // this is the variable that is sent to the contract as bytes, prefixed with 0x
    return `0x${pkHexLength}${pkPsBytes.toString('hex')}`;
  }

  build(data: any): any {
    return [
      data.publicKey,
      data.operatorIds,
      this.sharesToBytes(data.encryptedShares.map((share: EncryptShare) => share.publicKey), data.encryptedShares.map((share: EncryptShare) => share.privateKey)),
    ];
  }

  /**
   * Setting data in array or object format or cleaning it up.
   * @param data
   */
  setData(data: any): any {
    // Cleanup
    if (!data === null) {
      this.readable = null;
      return;
    }

    // Payload array
    if (_.isArray(data)) {
      this.readable = this.toReadable(data);
      return;
    }

    // Payload object (typically from key shares file)
    if (_.isObject(data)) {
      if (data.readable) {
        this.readable = data.readable;
      }
    }
  }

  /**
   * Building raw payload for web3.
   * @param payload
   */
  toRaw(payload: any[]): any {
    return payload.join(',');
  }

  /**
   * Building readable payload structure.
   * @param payload
   */
  toReadable(payload: any[]): any {
    return {
      publicKey: payload[KeySharesPayloadV3.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
      operatorIds: payload[KeySharesPayloadV3.PAYLOAD_INDEX_OPERATOR_IDS],
      shares: payload[KeySharesPayloadV3.PAYLOAD_INDEX_SHARES_KEYS],
      amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
      cluster: 'The latest cluster snapshot data, obtained using the cluster-scanner tool. If this is the cluster\'s 1st validator then use - {0,0,0,0,true}',
    };
  }

  validate(): any {
    // Find out how final payload can be validated.
  }
}
