import fs from 'fs';

import { BaseAction } from './BaseAction';
import { SSVKeys } from '../../lib/SSVKeys';
import { KeySharesItem } from '../../lib/KeyShares/KeySharesItem';
import { KeyShares } from '../../lib/KeyShares/KeyShares';

import { sanitizePath, keystorePasswordValidator } from './validators';

import {
  keystoreArgument,
  keystorePathArgument,
  ownerNonceArgument,
  operatorIdsArgument,
  ownerAddressArgument,
  keystorePasswordArgument,
  outputFolderArgument,
  operatorPublicKeysArgument,
} from './arguments';

import { getFilePath, getKeyStoreFiles, readFile, writeFile } from '../../lib/helpers/file.helper';

type Operator = {
  id: number;
  operatorKey: string;
};

/**
 * Command to build keyshares from user input.
 */
export class KeySharesAction extends BaseAction {
  static override get options(): any {
    return {
      action: 'shares',
      description: 'Generate shares for a list of operators from a validator keystore file',
      arguments: [
        keystoreArgument,
        keystorePathArgument,
        keystorePasswordArgument,
        operatorIdsArgument,
        operatorPublicKeysArgument,
        outputFolderArgument,
        ownerAddressArgument,
        ownerNonceArgument,
      ],
    }
  }

  override async execute(): Promise<string> {
    this.validateKeystoreArguments(); // Validate keystore arguments

    const keySharesList = await this.getKeySharesList();
    const keySharesFilePath = await this.saveKeyShares(keySharesList, this.args.output_folder);
    return keySharesFilePath;
  }

  private async getKeySharesList(): Promise<KeySharesItem[]> {
    if (this.args.keystore) {
      return [await this.processKeystore()];
    } else if (this.args.keystore_path) {
      return await this.processKeystorePath();
    }

    throw new Error('Either --keystore or --keystore-path must be provided.');
  }

  private validateKeystoreArguments(): void {
    const hasKeystore = !!this.args.keystore;
    const hasKeystorePath = !!this.args.keystore_path;

    if (hasKeystore && hasKeystorePath) {
      throw new Error('Only one of --keystore or --keystore-path should be provided.');
    }

    if (hasKeystorePath && !this.isDirectory(this.args.keystore_path)) {
      throw new Error('--keystore-path must be a directory.');
    }
  }

  private isDirectory(path: string): boolean {
    try {
      const stats = fs.statSync(path);
      return stats.isDirectory();
    } catch (error: any) {
      // Handle errors (like path does not exist)
      console.error(`Error checking if path is a directory: ${error.message}`);
      return false;
    }
  }

  private async processKeystorePath(): Promise<KeySharesItem[]> {
    const keystorePath = sanitizePath(String(this.args.keystore_path).trim());
    const { files } = await getKeyStoreFiles(keystorePath);
    const validatedFiles = await this.validateKeystoreFiles(files);

    const singleKeySharesList = await Promise.all(validatedFiles.map((file, index) =>
      this.processFile(file, this.args.password, this.getOperators(), this.args.owner_address, this.args.owner_nonce + index)
    ));

    return singleKeySharesList;
  }

  private async processKeystore(): Promise<KeySharesItem> {
    const keystore = this.args.keystore;
    await this.validateSingleKeystore(keystore);
    const singleKeyShares = await this.processFile(keystore, this.args.password, this.getOperators(), this.args.owner_address, this.args.owner_nonce);
    return singleKeyShares;
  }

  private async validateKeystoreFiles(files: string[]): Promise<string[]> {
    const validatedFiles = [];
    let failedValidation = 0;
    for (const file of files) {
      const isKeyStoreValid = await keystoreArgument.interactive.options.validateSingle(file);
      const isValidPassword = await keystorePasswordValidator.validatePassword(this.args.password, file);
      if (isKeyStoreValid === true && isValidPassword === true) {
        validatedFiles.push(file);
      } else {
        failedValidation++;
      }
      process.stdout.write(`\r${validatedFiles.length}/${files.length} keystore files successfully validated. ${failedValidation} failed validation`);
    }
    process.stdout.write('\n');
    return validatedFiles;
  }

  private async validateSingleKeystore(keystore: string): Promise<void> {
    const isKeyStoreValid = await keystoreArgument.interactive.options.validateSingle(keystore);
    if (isKeyStoreValid !== true) {
      throw Error(String(isKeyStoreValid));
    }
  }

  private getOperators(): Operator[] {
    return this.args.operator_keys.split(',').map((operatorKey: string, index: number) => ({
      id: parseInt(this.args.operator_ids.split(',')[index], 10),
      operatorKey,
    }));
  }

  private async processFile(keystoreFilePath: string, password: string, operators: Operator[], ownerAddress: string, ownerNonce: number): Promise<KeySharesItem> {
    const keystoreData = await readFile(keystoreFilePath);

    const ssvKeys = new SSVKeys();
    const { privateKey, publicKey } = await ssvKeys.extractKeys(keystoreData, password);
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    const keySharesItem = new KeySharesItem();
    await keySharesItem.update({ ownerAddress, ownerNonce, operators, publicKey });
    await keySharesItem.buildPayload({ publicKey, operators, encryptedShares }, { ownerAddress, ownerNonce, privateKey });

    return keySharesItem;
  }

  private async saveKeyShares(keySharesItems: KeySharesItem[], outputFolder: string): Promise<string> {
    const keyShares = new KeyShares();
    keySharesItems.forEach(keySharesItem => keyShares.add(keySharesItem));

    const keySharesFilePath = await getFilePath('keyshares', outputFolder.trim());
    await writeFile(keySharesFilePath, keyShares.toJson());

    return keySharesFilePath;
  }
}
