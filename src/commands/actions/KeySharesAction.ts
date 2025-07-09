import path from 'path';
import { Arguments } from 'yargs';
import { SSVKeys, KeySharesItem, KeyShares, SSVKeysException, OperatorsCountsMismatchError } from '../../main';
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
import { getFilePath, getKeyStoreFiles, readFile, writeFile } from '../../file.helper';

export interface ActionArgument {
  arg1: string;
  arg2: string;
  options: {
    alias?: string;
    describe?: string;
    type?: 'string' | 'number' | 'boolean';
    demandOption?: boolean;
    default?: any;
  };
}

export interface ActionOptions {
  action: string;
  arguments: ActionArgument[];
  description?: string;
}

export class BaseAction {
  protected args: Arguments = <Arguments>{};

  setArgs(args: Arguments): BaseAction {
    this.args = args;
    return this;
  }

  async execute(): Promise<any> {
    throw new SSVKeysException('Should implement "execute"');
  }

  static get options(): ActionOptions {
    throw new SSVKeysException('Should implement static "options"');
  }

  get options(): ActionOptions {
    return (this.constructor as typeof BaseAction).options;
  }

  preExecute(): void {
    return;
  }

  async preOptions(options: any): Promise<any> {
    return options;
  }

  static helpFooter: string = '';
}

type Operator = {
  id: number;
  operatorKey: string;
};

export class KeySharesAction extends BaseAction {
  static override get options(): ActionOptions {
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
    };
  }

  override async execute(): Promise<string> {
    this.validateKeystoreArguments();
    const keySharesList = await this.processKeystorePath();
    return await this.saveKeyShares(keySharesList, this.args.output_folder as string);
  }

  private validateKeystoreArguments(): void {
    if (!this.args.keystore) {
      throw new SSVKeysException('Please provide a path to the validator keystore file or folder containing multiple files.');
    }
  }

  private async processKeystorePath(): Promise<KeySharesItem[]> {
    const keystorePath = sanitizePath(String(this.args.keystore).trim());
    const { files } = await getKeyStoreFiles(keystorePath);
    const validatedFiles = await this.validateKeystoreFiles(files);

    return await Promise.all(validatedFiles.map((file, index) =>
      this.processFile(
        file,
        this.args.password as string,
        this.getOperators(),
        this.args.owner_address as string,
        this.args.owner_nonce as number + index
      )
    ));
  }

  private async validateKeystoreFiles(files: string[]): Promise<string[]> {
    const validatedFiles: string[] = [];
    let failedValidation = 0;
    for (const [index, file] of files.entries()) {
      const isKeyStoreValid = await keystoreArgument.interactive.options.validate(file);
      const isValidPassword = await keystorePasswordValidator.validatePassword(this.args.password as string, file);
      let status = '✅';
      if (isKeyStoreValid === true && isValidPassword === true) {
        validatedFiles.push(file);
      } else {
        failedValidation++;
        status = '❌';
      }
      const fileName = path.basename(file);
      process.stdout.write(`\r\n${index + 1}/${files.length} ${status} ${fileName}`);
    }
    process.stdout.write(`\n\n${files.length - failedValidation} of ${files.length} files validated, ${failedValidation} failed.\n`);
    return validatedFiles;
  }

  private getOperators(): Operator[] {
    const operatorIds = this.args.operator_ids.split(',');
    const operatorKeys = this.args.operator_keys.split(',');

    if (operatorIds.length !== operatorKeys.length) {
      throw new OperatorsCountsMismatchError(operatorIds, operatorKeys, 'Mismatch in number of operator IDs and keys.');
    }

    return operatorIds.map((idString: string, index: number) => {
      const id = parseInt(idString, 10);
      if (isNaN(id)) {
        throw new SSVKeysException(`Invalid operator ID at index ${index}: ${idString}`);
      }
      return { id, operatorKey: operatorKeys[index] };
    });
  }

  private async processFile(
    keystoreFilePath: string,
    password: string,
    operators: Operator[],
    ownerAddress: string,
    ownerNonce: number
  ): Promise<KeySharesItem> {
    const keystoreData = await readFile(keystoreFilePath);
    const ssvKeys = new SSVKeys();
    const { privateKey, publicKey } = await ssvKeys.extractKeys(keystoreData, password);
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    const keySharesItem = new KeySharesItem();
    await keySharesItem.update({ ownerAddress, ownerNonce, operators, publicKey });
    await keySharesItem.buildPayload(
      { publicKey, operators, encryptedShares },
      { ownerAddress, ownerNonce, privateKey }
    );
    return keySharesItem;
  }

  private async saveKeyShares(keySharesItems: KeySharesItem[], outputFolder: string): Promise<string> {
    if (keySharesItems.length === 0) {
      throw new SSVKeysException('No valid keystore files found.');
    }
    process.stdout.write(`\n\nGenerating keyshares file...\n`);
    const keyShares = new KeyShares();
    keySharesItems.forEach(item => keyShares.add(item));

    const keySharesFilePath = await getFilePath('keyshares', outputFolder.trim());
    await writeFile(keySharesFilePath, keyShares.toJson());
    return keySharesFilePath;
  }
}
