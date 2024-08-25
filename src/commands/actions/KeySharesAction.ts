import path from 'path';

import { BaseAction } from './BaseAction';
import { SSVKeys } from '../../lib/SSVKeys';
import { KeySharesItem } from '../../lib/KeyShares/KeySharesItem';
import { KeyShares } from '../../lib/KeyShares/KeyShares';
import { SSVKeysException } from '../../lib/exceptions/base';

import { sanitizePath, keystorePasswordValidator } from './validators';

import {
  keystoreArgument,
  ownerNonceArgument,
  operatorIdsArgument,
  ownerAddressArgument,
  keystorePasswordArgument,
  outputFolderArgument,
  operatorPublicKeysArgument,
} from './arguments';

import { getFilePath, getKeyStoreFiles, readFile, writeFile } from '../../lib/helpers/file.helper';
import { OperatorsCountsMismatchError } from '../../lib/exceptions/operator';

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

    const keySharesList = await this.processKeystorePath();
    const keySharesFilePath = await this.saveKeyShares(keySharesList, this.args.output_folder);
    return keySharesFilePath;
  }

  private validateKeystoreArguments(): void {
    const hasKeystore = !!this.args.keystore;
    if (!hasKeystore) {
      throw new SSVKeysException('Please provide a path to the validator keystore file or to the folder containing multiple validator keystore files.');
    }
  }

  private async processKeystorePath(): Promise<KeySharesItem[]> {
    const keystorePath = sanitizePath(String(this.args.keystore).trim());
    const { files } = await getKeyStoreFiles(keystorePath);
    const validatedFiles = await this.validateKeystoreFiles(files);

    const singleKeySharesList = await Promise.all(validatedFiles.map((file, index) =>
      this.processFile(file, this.args.password, this.getOperators(), this.args.owner_address, this.args.owner_nonce + index)
    ));

    return singleKeySharesList;
  }

  private async validateKeystoreFiles(files: string[]): Promise<string[]> {
    const validatedFiles = [];
    let failedValidation = 0;
    for (const [index, file] of files.entries()) {
      const isKeyStoreValid = await keystoreArgument.interactive.options.validate(file);
      const isValidPassword = await keystorePasswordValidator.validatePassword(this.args.password, file);
      let status = '✅';
      if (isKeyStoreValid === true && isValidPassword === true) {
        validatedFiles.push(file);
      } else {
        failedValidation++;
        status = '❌';
      }
      const fileName = path.basename(file); // Extract the file name
      process.stdout.write(`\r\n${index+ 1}/${files.length} ${status} ${fileName}`);
    }
    process.stdout.write(`\n\n${files.length - failedValidation} of ${files.length} keystore files successfully validated. ${failedValidation} failed validation`);

    process.stdout.write('\n');
    return validatedFiles;
  }

  private getOperators(): Operator[] {
    const operatorIds = this.args.operator_ids.split(',');
    const operatorKeys = this.args.operator_keys.split(',');

    if (operatorIds.length !== operatorKeys.length) {
      throw new OperatorsCountsMismatchError(operatorIds, operatorKeys, 'Mismatch amount of operator ids and operator keys.');
    }

    if (operatorIds.includes('') || operatorKeys.includes('')) {
      throw new SSVKeysException('Operator IDs or keys cannot contain empty strings.');
    }

    return operatorIds.map((idString: string, index: number) => {
      const id = parseInt(idString, 10);
      if (isNaN(id)) {
        throw new SSVKeysException(`Invalid operator ID at position ${index}: ${idString}`);
      }

      const operatorKey = operatorKeys[index];
      return { id, operatorKey };
    });
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
    if (keySharesItems.length === 0) {
      throw new SSVKeysException('Unable to locate valid keystore files. Please verify that the keystore files are valid and the password is correct.')
    }
    process.stdout.write(`\n\nGenerating Keyshares file, this might take a few minutes do not close terminal.`);

    const keyShares = new KeyShares();
    keySharesItems.forEach(keySharesItem => keyShares.add(keySharesItem));

    const keySharesFilePath = await getFilePath('keyshares', outputFolder.trim());
    await writeFile(keySharesFilePath, keyShares.toJson());

    return keySharesFilePath;
  }
}
