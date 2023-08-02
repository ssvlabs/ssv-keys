import { BaseAction } from './BaseAction';
import { SSVKeys } from '../../lib/SSVKeys';
import { KeyShares } from '../../lib/KeyShares/KeyShares';
import { sanitizePath } from './validators/file';
import keystorePathArgument from './arguments/keystore-path';
import ownerNonceArgument from './arguments/owner-nonce';
import ownerAddressArgument from './arguments/owner-address';
import multiSharesArgument from './arguments/multi-shares';
import keystorePasswordArgument from './arguments/password';
import outputFolderArgument from './arguments/output-folder';
import operatorsArgument from './arguments/custom-bulk/operators';
import operatorsDistributionArgument from './arguments/custom-bulk/operators-distribution';
import { keystorePasswordValidator } from './validators/keystore-password';

import { getFilePath, getKeyStoreFiles, readFile, readOperatorsDistributionFile, readOperatorsFile, writeFile } from '../../lib/helpers/file.helper';

/**
 * Command to build keyshares from user input.
 */
export class KeySharesCustomBulkAction extends BaseAction {
  private ownerNonce!: number;
  static override get options(): any {
    return {
      action: 'custom-bulk',
      description: 'Generate shares for a operators and distribution per cluster csv files',
      arguments: [
        keystorePathArgument,
        multiSharesArgument,
        keystorePasswordArgument,
        outputFolderArgument,
        ownerAddressArgument,
        ownerNonceArgument,
        operatorsArgument,
        operatorsDistributionArgument,
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  override async execute(): Promise<any> {
    const {
      keystore_path: keystorePath,
      operators: operatorsFile,
      operators_distribution: operatorsDistributionFile,
      password,
      output_folder: outputFolder,
      owner_address: ownerAddress,
      owner_nonce: ownerNonce,
      multi_shares: multiShares,
    } = this.args;

    // Now save to key shares file encrypted shares and validator public key
    /*
    const operators = operatorKeys.map((operatorKey: string, index: number) => ({
      id: operatorIds[index],
      operatorKey,
    }));
    */
    const operators = readOperatorsFile(sanitizePath(operatorsFile));
    const operatorsDistribution = readOperatorsDistributionFile(sanitizePath(operatorsDistributionFile));

    const operatorGroups: { id: number; operatorKey: string }[][] = operatorsDistribution.map((operatorRow) =>
      operatorRow.map((id) => ({
        id: id,
        operatorKey: operators.get(id) || 'unknown',
      }))
    );

    let outputFiles: any = [];
    const bulkProcess = multiShares || true;
    if (bulkProcess) {
      const { files } = await getKeyStoreFiles(sanitizePath(keystorePath));
      // validate all files
      for (const file of files) {
        const isKeyStoreValid = await keystorePathArgument.validateSingle(file);
        if (isKeyStoreValid !== true) {
          throw Error(String(isKeyStoreValid));
        }
        const isValidPassword = await keystorePasswordValidator.validatePassword(password, file);
        if (isValidPassword !== true) {
          throw Error(String(isValidPassword));
        }
      }
      this.ownerNonce = ownerNonce;
      let processedFilesCount = 0;
      console.debug('Splitting keystore files to shares, do not terminate process!');
      for (const file of files) {
        const keySharesFiles = await this._processFile(file, password, outputFolder, operatorGroups, ownerAddress);
        outputFiles = [...outputFiles, ...keySharesFiles];

        processedFilesCount++;
        process.stdout.write(`\r${processedFilesCount}/${files.length} keystore files successfully split into shares`);
      }
    } else {
      const isKeyStoreValid = await keystorePathArgument.validateSingle(keystorePath);
      if (isKeyStoreValid !== true) {
        throw Error(String(isKeyStoreValid));
      }
      const isValidPassword = await keystorePasswordValidator.validatePassword(password, keystorePath);
      if (isValidPassword !== true) {
        throw Error(String(isValidPassword));
      }
      const keySharesFiles = await this._processFile(keystorePath, password, outputFolder, operatorGroups, ownerAddress);
      outputFiles = [...keySharesFiles];
    }
    return outputFiles;
  }

  private async _processFile(keystoreFilePath: string, password: string, outputFolder: string, operatorGroups: any[], ownerAddress: string) {
    const keystoreData = await readFile(keystoreFilePath);

    // Initialize SSVKeys SDK
    const ssvKeys = new SSVKeys();
    const { privateKey, publicKey } = await ssvKeys.extractKeys(keystoreData, password);

    const keySharesFiles = [];
    for (const [index, operators] of operatorGroups.entries()) {
      // Build shares from operator IDs and public keys
      const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

      const keyShares = new KeyShares();
      await keyShares.update({
        ownerAddress,
        ownerNonce: this.ownerNonce,
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
        ownerNonce: this.ownerNonce,
        privateKey,
      });

      const keySharesFilePath = await getFilePath('keyshares-files', outputFolder.trim(), `${index}`);
      await writeFile(keySharesFilePath, keyShares.toJson());
      keySharesFiles.push(keySharesFilePath);
      this.ownerNonce++;
    }

    return keySharesFiles;
  }
}
