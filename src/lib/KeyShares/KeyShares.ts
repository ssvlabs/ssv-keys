import _ from 'underscore';
import {
  IsString,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  validateOrReject
} from 'class-validator';
import { KeySharesDataV2 } from './KeySharesData/KeySharesDataV2';
import { KeySharesPayloadV2 } from './KeySharesData/KeySharesPayloadV2';

export type KeySharesData = KeySharesDataV2;
export type KeySharesPayload = KeySharesPayloadV2;

/**
 * Keyshares data interface.
 */
export class KeyShares {
  static VERSION_V2 = 'v2';
  static PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
  static PAYLOAD_INDEX_OPERATOR_IDS = 1;
  static PAYLOAD_INDEX_SHARE_PUBLIC_KEYS = 2;
  static PAYLOAD_INDEX_SHARE_PRIVATE_KEYS = 3;
  static PAYLOAD_INDEX_SSV_AMOUNT = 4;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public version: string;

  @ValidateNested()
  public data?: KeySharesData | undefined;

  @ValidateNested()
  public payload?: KeySharesPayload | undefined;

  /**
   * @param version
   */
  constructor({ version }: { version: string }) {
    this.version = version;
  }

  /**
   * Set final payload for web3 transaction and validate it.
   * @param payload
   */
  async setPayload(payload: any): Promise<KeyShares> {
    if (payload) {
      this.payload = this.usePayload(payload, this.version);
      await this.validatePayload();
    }
    return this;
  }

  /**
   * Set new data and validate it.
   * @param data KeySharesData
   */
  async setData(data: any): Promise<KeyShares> {
    if (data) {
      this.data = this.useData(data, this.version);
      await this.validateData();
    }
    return this;
  }

  /**
   * Instantiate keyshare from raw data as string or object.
   * @param data
   */
  static async fromData(data: string | any): Promise<KeyShares> {
    // Parse json
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    const keyShares = new KeyShares({ version: data.version });
    await keyShares.setData(data.data);
    await keyShares.setPayload(data.payload);
    await keyShares.validate();
    return keyShares;
  }

  /**
   * Get final data converted from raw data.
   * @param payload
   * @param version
   */
  usePayload(payload: any, version: string) {
    if (_.isArray(payload)) {
      payload = {
        readable: {
          validatorPublicKey: payload[KeyShares.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
          operatorIds: payload[KeyShares.PAYLOAD_INDEX_OPERATOR_IDS],
          sharePublicKeys: payload[KeyShares.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS],
          sharePrivateKey: payload[KeyShares.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS],
          ssvAmount: payload[KeyShares.PAYLOAD_INDEX_SSV_AMOUNT],
        },
        raw: payload.join(','),
      };
    }
    payload = {
      ...JSON.parse(JSON.stringify(this.payload || {})),
      ...JSON.parse(JSON.stringify(payload || {})),
    };
    switch (version) {
      case KeyShares.VERSION_V2:
        return new KeySharesPayloadV2(payload);
      default:
        throw Error(`Keyshares version is not supported: ${version}`);
    }
  }

  /**
   * Get final data converted from raw data.
   * @param data
   * @param version
   */
  useData(data: any, version: string) {
    data = {
      ...JSON.parse(JSON.stringify(this.data || {})),
      ...JSON.parse(JSON.stringify(data || {})),
    };
    if (_.isArray(data.shares)) {
      data.shares = {
        publicKeys: data.shares.map((share: { publicKey: string; }) => share.publicKey),
        encryptedKeys: data.shares.map((share: { privateKey: string; }) => share.privateKey),
      }
    }
    switch (version) {
      case KeyShares.VERSION_V2:
        return new KeySharesDataV2(data);
      default:
        throw Error(`Keyshares version is not supported: ${version}`);
    }
  }

  /**
   * Validate everything
   */
  async validate() {
    // Validate classes and structures
    await validateOrReject(this).catch(errors => {
      throw Error(`Keyshares file have wrong format. Errors: ${JSON.stringify(errors, null, '  ')}`);
    });

    // Validate data and payload
    await this.validateData();
    await this.validatePayload();
  }

  /**
   * Validate payload
   */
  async validatePayload() {
    try {
      await this.payload?.validate();
    } catch (errors: any) {
      throw Error(`Keyshares payload did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
    }
  }

  /**
   * Validate data
   */
  async validateData() {
    try {
      await this.data?.validate();
    } catch (errors: any) {
      throw Error(`Keyshares data did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
    }
  }

  /**
   * Stringify keyshare to be ready for saving in file.
   */
  toString(): string {
    return JSON.stringify({
      version: this.version,
      data: this.data || null,
      payload: this.payload || null,
      createdAt: new Date().toISOString()
    }, null, '  ');
  }
}
