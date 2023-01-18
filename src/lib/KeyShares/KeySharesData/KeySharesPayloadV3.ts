import _ from 'underscore';
import { IsString, IsObject, IsOptional } from 'class-validator';
import { IKeySharesPayload } from './IKeySharesPayload';

/**
 * Key Shares Payload v2.
 */
export class KeySharesPayloadV3 implements IKeySharesPayload {
  static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
  static PAYLOAD_INDEX_OPERATOR_IDS = 1;
  static PAYLOAD_INDEX_SHARES_KEYS = 2;
  static PAYLOAD_INDEX_SSV_AMOUNT = 3;

  @IsOptional()
  @IsObject()
  public readable?: any = null;

  @IsOptional()
  @IsString()
  public raw?: string | null = null;

  /**
   * Setting data in array or object format or cleaning it up.
   * @param data
   */
  setData(data: any): any {
    // Cleanup
    if (!data === null) {
      this.raw = null;
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
      validatorPublicKey: payload[KeySharesPayloadV3.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
      operatorIds: payload[KeySharesPayloadV3.PAYLOAD_INDEX_OPERATOR_IDS],
      shares: payload[KeySharesPayloadV3.PAYLOAD_INDEX_SHARES_KEYS],
      ssvAmount: payload[KeySharesPayloadV3.PAYLOAD_INDEX_SSV_AMOUNT],
    };
  }

  async validate(): Promise<any> {
    // Find out how final payload can be validated.
  }
}
