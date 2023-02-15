import _ from 'underscore';
import { abiEncode } from '../../helpers/web3.helper';

import { IsString, IsObject, IsOptional } from 'class-validator';
import { IKeySharesPayload } from './IKeySharesPayload';
import { EncryptShare } from '../../Encryption/Encryption';

/**
 * Key Shares Payload v2.
 */
export class KeySharesPayloadV2 implements IKeySharesPayload {
  static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
  static PAYLOAD_INDEX_OPERATOR_IDS = 1;
  static PAYLOAD_INDEX_SHARE_PUBLIC_KEYS = 2;
  static PAYLOAD_INDEX_SHARE_PRIVATE_KEYS = 3;

  @IsOptional()
  @IsObject()
  public readable?: any = null;

  @IsOptional()
  @IsString()
  public raw?: string | undefined = undefined;

  build(data: any): any {
    return [
      data.publicKey,
      data.operatorIds.join(','),
      data.encryptedShares.map((share: EncryptShare) => share.publicKey),
      abiEncode(data.encryptedShares, 'privateKey'),
    ];
  }

  /**
   * Setting data in array or object format or cleaning it up.
   * @param data
   */
  setData(data: any): any {
    // Cleanup
    if (!data === null) {
      this.raw = undefined;
      this.readable = null;
      return;
    }

    // Payload array
    if (_.isArray(data)) {
      this.raw = this.toRaw(data);
      this.readable = this.toReadable(data);
      return;
    }

    // Payload object (typically from key shares file)
    if (_.isObject(data)) {
      if (data.readable) {
        this.readable = data.readable;
      }
      if (data.raw) {
        this.raw = data.raw;
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
      publicKey: payload[KeySharesPayloadV2.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
      operatorIds: payload[KeySharesPayloadV2.PAYLOAD_INDEX_OPERATOR_IDS],
      sharePublicKeys: payload[KeySharesPayloadV2.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS],
      sharePrivateKey: payload[KeySharesPayloadV2.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS],
      amount: 'Amount of SSV tokens to be deposited to your validator\'s cluster balance (mandatory only for 1st validator in a cluster)',
    };
  }

  async validate(): Promise<any> {
    // Find out how final payload can be validated.
  }
}
