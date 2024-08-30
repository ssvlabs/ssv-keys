import semver from 'semver';
import pkg from '../../../package.json';

import { IsOptional, ValidateNested, validateSync } from 'class-validator';
import { KeySharesItem } from './KeySharesItem';
import { SSVKeysException } from '../exceptions/base';

/**
 * Represents a collection of KeyShares items with functionality for serialization,
 * deserialization, and validation.
 */
export class KeyShares {
  @IsOptional()
  @ValidateNested({ each: true })
  private shares: KeySharesItem[];

  constructor(shares: KeySharesItem[] = []) {
    this.shares = [...shares];
  }

  /**
   * Add a single KeyShares item to the collection.
   * @param keySharesItem The KeyShares item to add.
   */
  add(keySharesItem: KeySharesItem): void {
    this.shares.push(keySharesItem);
  }

  list(): KeySharesItem[] {
    return this.shares;
  }

  /**
   * Validate the KeyShares instance using class-validator.
   * @returns The validation result.
   */
  validate(): any {
    validateSync(this);
  }

  /**
   * Converts the KeyShares instance to a JSON string.
   * @returns The JSON string representation of the KeyShares instance.
   */
  toJson(): string {
    return JSON.stringify({
      version: `v${pkg.version}`,
      createdAt: new Date().toISOString(),
      shares: this.shares.length > 0 ? this.shares : null,
    }, null, 2);
  }

  /**
   * Initialize the KeyShares instance from JSON or object data.
   * @param content The JSON string or object to initialize from.
   * @returns The KeyShares instance.
   * @throws Error if the version is incompatible or the shares array is invalid.
   */
  static async fromJson(content: string | any): Promise<KeyShares> {
    const body = typeof content === 'string' ? JSON.parse(content) : content;
    const extVersion = semver.parse(body.version);
    const currentVersion = semver.parse(pkg.version);
    const tmpPrevVersion = semver.parse('v1.1.0');

    if (!extVersion || !currentVersion || !tmpPrevVersion) {
      throw new SSVKeysException(`The file for keyshares must contain a version mark provided by ssv-keys.`);
    }
    if (!extVersion || (currentVersion.major !== extVersion.major) || (currentVersion.minor !== extVersion.minor && tmpPrevVersion.minor !== extVersion.minor)) {
      throw new SSVKeysException(`The keyshares file you are attempting to reuse does not have the same version (v${pkg.version}) as supported by ssv-keys`);
    }

    const instance = new KeyShares();
    instance.shares = [];

    if (Array.isArray(body.shares)) {
      // Process each item in the array
      for (const item of body.shares) {
        instance.shares.push(await KeySharesItem.fromJson(item));
      }
    } else {
      // Handle old format (single item)
      instance.shares.push(await KeySharesItem.fromJson(body));
    }
    return instance;
  }
}
