import { IsString, ValidateNested, validateOrReject } from 'class-validator';
import { KeySharesDataV2 } from './KeySharesData/KeySharesDataV2';

export type KeySharesData = KeySharesDataV2;

/**
 * Keyshares data interface.
 */
export class KeyShares {
  @IsString()
  public version: string;

  @ValidateNested()
  public data: KeySharesData;

  /**
   * Receives as parameter already read and json parsed structure.
   * @param version
   * @param data
   */
  constructor({ version, data }: { version: string, data: KeySharesData }) {
    this.version = version;
    this.data = data;
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
    switch (data.version) {
      case 'v2':
        keySharesDataInstance = new KeySharesDataV2(data.data);
        break;
      default:
        throw Error(`Keyshares version is not supported: ${data.version}`);
    }

    // Create keyshares instance
    const keyShares = new KeyShares({
      version: data.version,
      data: keySharesDataInstance,
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

    return keyShares;
  }

  /**
   * Stringify keyshare to be ready for saving in file.
   */
  toString(): string {
    return JSON.stringify({
      version: this.version,
      data: this.data,
      createdAt: new Date().toISOString()
    }, null, '  ');
  }
}
