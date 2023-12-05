import semver from 'semver';
import pkg from '../../../package.json';

import { IsOptional, ValidateNested, validateSync } from 'class-validator';
import { KeySharesItem } from './KeySharesItem';

/**
 * Represents a collection of KeyShares items with functionality for serialization,
 * deserialization, and validation.
 */
export class KeyShares {
  @IsOptional()
  @ValidateNested({ each: true })
  private shares: KeySharesItem[];

  constructor() {
    this.shares = [];
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
  async fromJson(content: string | any): Promise<KeyShares> {
    const body = typeof content === 'string' ? JSON.parse(content) : content;
    const extVersion = semver.parse(body.version);
    const currentVersion = semver.parse(pkg.version);

    if (!extVersion || !currentVersion) {
      throw new Error(`The file for keyshares must contain a version mark provided by ssv-keys.`);
    }

    if (!extVersion || (currentVersion.major !== extVersion.major) || (currentVersion.minor !== extVersion.minor)) {
      throw new Error(`The keyshares file you are attempting to reuse does not have the same version (v${pkg.version}) as supported by ssv-keys`);
    }

    this.shares = [];

    // Using a helper function to process each item
    const processItem = async (item: any) => {
      const keySharesItem = new KeySharesItem();
      await keySharesItem.fromJson(item);
      return keySharesItem;
    };

    if (Array.isArray(body.shares)) {
      // Process each item in the array
      for (const item of body.shares) {
        const processedItem = await processItem(item);
        this.shares.push(processedItem);
      }
    } else {
      // Handle old format (single item)
      const processedItem = await processItem(body);
      this.shares.push(processedItem);
    }

    return this;
  }
}
