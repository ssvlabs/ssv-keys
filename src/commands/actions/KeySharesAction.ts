import colors from 'colors/safe';
import { BaseAction } from './BaseAction';
import { SSVKeys } from '../../lib/SSVKeys';
import keystoreArgument from './arguments/keystore';
import { ISharesKeyPairs } from '../../lib/Threshold';
import ssvAmountArgument from './arguments/ssv-amount';
import { KeyShares } from '../../lib/KeyShares/KeyShares';
import operatorIdsArgument from './arguments/operator-ids';
import keystorePasswordArgument from './arguments/password';
import outputFolderArgument from './arguments/output-folder';
import { EncryptShare } from '../../lib/Encryption/Encryption';
import { getFilePath, readFile, writeFile } from '../../lib/helpers';
import operatorPublicKeysArgument from './arguments/operator-public-keys';


export type EncryptedSharesResult = {
  privateKey: string,
  keystore: string,
  password: string,
  payload: any[],
  operatorIds: number[],
  operatorPublicKeys: string[],
  shares: EncryptShare[],
  threshold: ISharesKeyPairs
};

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
        ssvAmountArgument,
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
      ssv_token_amount: ssvAmount,
    } = this.args;
    let {
      operators_ids: operatorIds,
      operators_keys: operatorKeys,
    } = this.args;

    operatorKeys = operatorKeys.split(',');
    operatorIds = operatorIds.split(',').map((o: string) => parseInt(o, 10));

    const { payload, threshold, shares } = await this.encryptShares(
      keystore,
      password,
      operatorIds,
      operatorKeys,
      ssvAmount,
    );

    // Build keyshares file
    const operatorsData: any = [];
    operatorKeys.map((operator: any, index: string | number) => {
      operatorsData.push({
        id: operatorIds[index],
        publicKey: operator,
      })
    });

    const keySharesData = {
      version: 'v2',
      data: {
        publicKey: threshold.validatorPublicKey,
        operators: operatorsData,
        shares: {
          publicKeys: shares.map(share => share.publicKey),
          encryptedKeys: shares.map(share => share.privateKey),
        },
      },
      payload: {
        readable: {
          validatorPublicKey: payload[KeyShares.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
          operatorIds: payload[KeyShares.PAYLOAD_INDEX_OPERATOR_IDS],
          sharePublicKeys: payload[KeyShares.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS],
          sharePrivateKey: payload[KeyShares.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS],
          ssvAmount: payload[KeyShares.PAYLOAD_INDEX_SSV_AMOUNT],
        },
        raw: payload.join(','),
      },
    };

    const keySharesFile = await KeyShares.fromData(keySharesData);
    const keySharesFilePath = await getFilePath('keyshares', outputFolder.trim());
    await writeFile(keySharesFilePath, keySharesFile.toString());
    return `\nKey distribution successful! Find your key shares file at ${colors.bgYellow(colors.black(keySharesFilePath))}\n`;
  }

  /**
   * Encrypt shares and return all information that can be useful.
   * @param keystore
   * @param password
   * @param operatorIds
   * @param operatorPublicKeys
   * @param ssvAmount
   */
  async encryptShares(
    keystore: string,
    password: string,
    operatorIds: number[],
    operatorPublicKeys: string[],
    ssvAmount: number): Promise<EncryptedSharesResult> {

    // Step 1: read keystore file
    const data = await readFile(String(keystore).trim());

    // Step 2: decrypt private key using keystore file and password
    const ssvKeys = new SSVKeys();
    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreData(data, password);

    // Step 3: Build shares from operator IDs and public keys
    const threshold: ISharesKeyPairs = await ssvKeys.createThreshold(privateKey, operatorIds);
    const shares = await ssvKeys.encryptShares(operatorPublicKeys, threshold.shares);

    // Step 4: Build final web3 transaction payload
    const payload = await ssvKeys.buildPayload(
      threshold.validatorPublicKey,
      operatorIds,
      shares,
      ssvAmount
    );

    return {
      privateKey,
      keystore,
      password,
      operatorIds,
      operatorPublicKeys,
      shares,
      threshold,
      payload,
    }
  }
}
