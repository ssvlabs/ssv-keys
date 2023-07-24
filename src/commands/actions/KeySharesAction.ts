import { BaseAction } from './BaseAction';
import { SSVKeys } from '../../lib/SSVKeys';
import { KeyShares } from '../../lib/KeyShares/KeyShares';
import { sanitizePath } from './validators/file';
import keystoreArgument from './arguments/keystore';
import ownerNonce from './arguments/owner-nonce';
import operatorIdsArgument from './arguments/operator-ids';
import ownerAddress from './arguments/owner-address';
import keystorePasswordArgument from './arguments/password';
import outputFolderArgument from './arguments/output-folder';
import operatorPublicKeysArgument from './arguments/operator-public-keys';
import { keystorePasswordValidator } from './validators/keystore-password';

import { getFilePath, getKeyStoreFiles, readFile, writeFile } from '../../lib/helpers/file.helper';

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
        ownerAddress,
        ownerNonce,
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  override async execute(): Promise<any> {
    const {
      keystore,
      password,
      output_folder: outputFolder,
      owner_address: ownerAddress,
      owner_nonce: ownerNonce,
    } = this.args;

    let {
      operator_ids: operatorIds,
      operator_keys: operatorKeys,
    } = this.args;
    // Prepare data
    operatorKeys = operatorKeys.split(',');
    operatorIds = operatorIds.split(',').map((o: string) => parseInt(o, 10));

    // Now save to key shares file encrypted shares and validator public key
    const operators = operatorKeys.map((operatorKey: string, index: number) => ({
      id: operatorIds[index],
      operatorKey,
    }));

    const keystorePath = sanitizePath(String(keystore).trim());

    const { files, isFolder } = await getKeyStoreFiles(keystorePath);

    // validate all files
    for (const file of files) {
      const isKeyStoreValid = await keystoreArgument.interactive.options.validateSingle(file);
      if (isKeyStoreValid !== true) {
        throw Error(String(isKeyStoreValid));
      }
      const isValidPassword = await keystorePasswordValidator.validatePassword(password, file);
      if (isValidPassword !== true) {
        throw Error(String(isValidPassword));
      }
    }

    const outputFiles = [];
    let nextNonce = ownerNonce;
    let processedFilesCount = 0;
    isFolder && console.debug('Splitting keystore files to shares, do not terminate process!');
    for (const file of files) {
      const keySharesFilePath = await this._processFile(file, password, outputFolder, operators, ownerAddress, nextNonce);
      outputFiles.push(keySharesFilePath);

      if (isFolder) {
        processedFilesCount++;
        process.stdout.write(`\r${processedFilesCount}/${files.length} keystore files successfully split into shares`);
      }

      nextNonce++;
    }
    process.stdout.write('\n');
    return outputFiles;
  }

  private async _processFile(keystoreFilePath: string, password: string, outputFolder: string, operators: any[], ownerAddress: string, ownerNonce: number) {
    const keystoreData = await readFile(keystoreFilePath);

    // Initialize SSVKeys SDK
    const ssvKeys = new SSVKeys();
    const { privateKey, publicKey } = await ssvKeys.extractKeys(keystoreData, password);

    // Build shares from operator IDs and public keys
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    const keyShares = new KeyShares();
    await keyShares.update({
      ownerAddress,
      ownerNonce,
      operators,
      publicKey,
    });

    // Build payload and save it in key shares file
    await keyShares.buildPayload({
      publicKey,
      operators,
      encryptedShares,
    }, {
      ownerAddress,
      ownerNonce,
      privateKey,
    });

    const keySharesFilePath = await getFilePath('keyshares-files', outputFolder.trim());
    await writeFile(keySharesFilePath, keyShares.toJson());
    return keySharesFilePath;
  }
}
