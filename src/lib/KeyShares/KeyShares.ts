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

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  public version: string;

  @ValidateNested()
  public data: KeySharesData;

  @ValidateNested()
  public payload: KeySharesPayload;

  /**
   * Receives as parameter already read and json parsed structure.
   * @param version
   * @param data
   * @param payload
   */
  constructor({ version, data, payload }: { version: string, data: KeySharesData, payload: KeySharesPayload }) {
    this.version = version;
    this.data = data;
    this.payload = payload;
  }

  /**
   * Set final payload for web3 transaction and validate it.
   * @param payload
   */
  async setPayload(payload: KeySharesPayload): Promise<KeyShares> {
    this.payload = payload;
    await this.payload.validate();
    return this;
  }

  /**
   * Set new data and validate it.
   * @param data
   */
  async setData(data: KeySharesData): Promise<KeyShares> {
    this.data = data;
    await this.data.validate();
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

    // Create keyshares data instance depending on version
    let keySharesDataInstance: KeySharesData;
    let keySharesPayloadInstance: KeySharesPayload;
    switch (data.version) {
      case KeyShares.VERSION_V2:
        keySharesDataInstance = new KeySharesDataV2(data.data || {});
        keySharesPayloadInstance = new KeySharesPayloadV2(data.payload || {});
        break;
      default:
        throw Error(`Keyshares version is not supported: ${data.version}`);
    }

    // Create keyshares instance
    const keyShares = new KeyShares({
      version: data.version,
      data: keySharesDataInstance,
      payload: keySharesPayloadInstance,
    });

    // Validate classes and structures
    await validateOrReject(keyShares).catch(errors => {
      throw Error(`Keyshares file have wrong format. Errors: ${JSON.stringify(errors, null, '  ')}`);
    });

    // Deeper validation of data itself
    try {
      await keyShares.data.validate();
    } catch (errors: any) {
      throw Error(`Keyshares data did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
    }

    // Deeper validation of payload if exists
    try {
      await keyShares.payload.validate();
    } catch (errors: any) {
      throw Error(`Keyshares payload did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
    }

    return keyShares;
  }

  /**
   * Stringify keyshare to be ready for saving in file.
   */
  toString(): string {
    return JSON.stringify({
      version: this.version,
      data: this.data,
      payload: this.payload,
      createdAt: new Date().toISOString()
    }, null, '  ');
  }
}
