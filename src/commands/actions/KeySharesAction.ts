import colors from 'colors/safe';
import { BaseAction } from './BaseAction';
import { SSVKeys, KeyShares } from '../../main';
import { sanitizePath } from './validators/file';
import keystoreArgument from './arguments/keystore';
import operatorIdsArgument from './arguments/operator-ids';
import keystorePasswordArgument from './arguments/password';
import outputFolderArgument from './arguments/output-folder';
import operatorPublicKeysArgument from './arguments/operator-public-keys';
import { keystorePasswordValidator } from './validators/keystore-password';

import { getFilePath, readFile, writeFile } from '../../lib/helpers/file.helper';

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
    } = this.args;

    let {
      operator_ids: operatorIds,
      operator_keys: operatorKeys,
    } = this.args;
    // Prepare data
    operatorKeys = operatorKeys.split(',');
    operatorIds = operatorIds.split(',').map((o: string) => parseInt(o, 10));

    const isKeyStoreValid = keystoreArgument.interactive.options.validate(keystore);
    if (isKeyStoreValid !== true) {
      throw Error(String(isKeyStoreValid));
    }
    const isValidPassword = await keystorePasswordValidator.validatePassword(password);
    if (isValidPassword !== true) {
      throw Error(String(isValidPassword));
    }

    const keystoreFilePath = sanitizePath(String(keystore).trim());
    const keystoreData = await readFile(keystoreFilePath);

    // Initialize SSVKeys SDK
    const ssvKeys = new SSVKeys();
    const { privateKey, publicKey } = await ssvKeys.extractKeys(keystoreData, password);

    // Now save to key shares file encrypted shares and validator public key
    const operators = operatorKeys.map((publicKey: string, index: number) => ({
      id: operatorIds[index],
      publicKey,
    }));

    // Build shares from operator IDs and public keys
    const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

    const keyShares = new KeyShares();
    await keyShares.update({
      operators,
      publicKey,
    });

    // Build payload and save it in key shares file
    await keyShares.buildPayload({
      publicKey,
      operators,
      encryptedShares,
    });

    const keySharesFilePath = await getFilePath('keyshares', outputFolder.trim());
    await writeFile(keySharesFilePath, keyShares.toJson());
    return `\nKey distribution successful! Find your key shares file at ${colors.bgYellow(colors.black(keySharesFilePath))}\n`;
  }
}
