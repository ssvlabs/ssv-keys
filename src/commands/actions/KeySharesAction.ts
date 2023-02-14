import colors from 'colors/safe';
import { BaseAction } from './BaseAction';
import { SSVKeys } from '../../lib/SSVKeys';
import { sanitizePath } from './validators/file';
import keystoreArgument from './arguments/keystore';
import operatorIdsArgument from './arguments/operator-ids';
import keystorePasswordArgument from './arguments/password';
import keySharesVersionArgument from './arguments/key-shares-version';

import outputFolderArgument from './arguments/output-folder';
import { getFilePath, readFile, writeFile } from '../../lib/helpers/file.helper';
import operatorPublicKeysArgument from './arguments/operator-public-keys';

/**
 * Command to build keyshares from user input.
 */
export class KeySharesAction extends BaseAction {
  static override get options(): any {
    return {
      action: 'key-shares',
      shortAction: 'ksh',
      description: 'Generate shares for a list of operators from a validator keystore file',
      arguments: [
        keystoreArgument,
        keystorePasswordArgument,
        operatorIdsArgument,
        operatorPublicKeysArgument,
        keySharesVersionArgument,
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
      key_shares_version: keySharesVersion,
    } = this.args;

    let {
      operators_ids: operatorIds,
      operators_keys: operatorKeys,
    } = this.args;

    // Prepare data
    operatorKeys = operatorKeys.split(',');
    operatorIds = operatorIds.split(',').map((o: string) => parseInt(o, 10));
    const keystoreFilePath = sanitizePath(String(keystore).trim());
    const keystoreData = await readFile(keystoreFilePath);

    // Initialize SSVKeys SDK
    const ssvKeys = new SSVKeys(`v${keySharesVersion}`);
    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(keystoreData, password);

    // Build shares from operator IDs and public keys
    const encryptedShares = await ssvKeys.buildShares(privateKey, operatorIds, operatorKeys);

    // Now save to key shares file encrypted shares and validator public key
    const keyShares = await ssvKeys.keyShares.fromJson({});
    await keyShares.setData({
      operators: operatorKeys.map((operator: string, index: number) => ({
        id: operatorIds[index],
        publicKey: operator,
      })),
      publicKey: ssvKeys.publicKey,
      encryptedShares,
    });

    // Build payload and save it in key shares file
    await ssvKeys.buildPayload(
      {
        publicKey: ssvKeys.publicKey,
        operatorIds,
        encryptedShares,
      },
    );

    const keySharesFilePath = await getFilePath('keyshares', outputFolder.trim());
    await writeFile(keySharesFilePath, ssvKeys.keyShares.toJson());
    return `\nKey distribution successful! Find your key shares file at ${colors.bgYellow(colors.black(keySharesFilePath))}\n`;
  }
}
