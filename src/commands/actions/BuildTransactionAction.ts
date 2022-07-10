import Web3 from 'web3';
import colors from 'colors/safe';
import { BuildSharesAction } from './BuildSharesAction';
import { getFilePath, writeFile } from '../../lib/helpers';

const web3 = new Web3();

export class BuildTransactionAction extends BuildSharesAction {
  static SSV_AMOUNT_ARGUMENT = {
    arg1: '-ssv',
    arg2: '--ssv-token-amount',
    options: {
      type: String,
      required: true,
      help: 'Token amount fee required for this transaction in Wei. ' +
        'Calculated as: totalFee := allOperatorsFee + networkYearlyFees + liquidationCollateral. '
    },
    interactive: {
      options: {
        type: 'text',
        validate: (tokenAmount: string) => {
          try {
            web3.utils.toBN(tokenAmount).toString();
            return true;
          } catch (e) {
            return 'Token amount should be positive big number in Wei';
          }
        }
      }
    }
  };

  static get options(): any {
    return {
      action: 'transaction',
      shortAction: 'tr',
      description: 'Generate shares for a list of operators from a validator keystore file and output registration transaction payload',
      arguments: [
        BuildTransactionAction.KEYSTORE_ARGUMENT,
        BuildTransactionAction.PASSWORD_ARGUMENT,
        BuildTransactionAction.OPERATORS_PUBLIC_KEYS_ARGUMENT,
        BuildTransactionAction.OPERATORS_IDS_ARGUMENT,
        BuildTransactionAction.SSV_AMOUNT_ARGUMENT,
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  async execute(): Promise<any> {
    const {
      privateKey,
      operatorsIds,
      shares,
    } = await this.dispatch();

    const { ssv_amount: ssvAmount } = this.args;

    // Step 4: build payload using encrypted shares
    const payload = await this.ssvKeys.buildPayload(
      privateKey,
      operatorsIds,
      shares,
      ssvAmount
    );

    const explainedPayload = '' +
      '\n[\n' +
      `\n\t validator public key   ➡️   ${payload[0]}\n` +
      `\n\t operators IDs          ➡️   array${payload[1]}\n` +
      '\n\t share public keys      ➡️   array[\n' +
      payload[2].map((publicKey: string, index: number) => `\n\t                                   [${index}]: ${publicKey}\n`).join('') +
      '                                 ]\n' +
      '\n\t share private keys     ➡️   array[\n' +
      payload[3].map((privateKey: string, index: number) => `\n\t                                   [${index}]: ${privateKey}\n`).join('') +
      '                                 ]\n' +
      `\n\t ssv amount             ➡️   ${payload[4]}\n` +
      '\n]\n';

    const payloadFilePath = await getFilePath('payload');
    const message = '✳️  Transaction payload have the following structure encoded as ABI Params: \n' +
      '\n[\n' +
      '\n\tvalidatorPublicKey           ➡️   String\n' +
      '\n\toperators IDs                ➡️   array[<operator ID>,         ..., <operator ID>]\n' +
      '\n\tsharePublicKeys              ➡️   array[<share public key>,    ..., <share public key>]\n' +
      '\n\tshareEncrypted               ➡️   array[<share private key>,   ..., <share private key>]\n' +
      '\n\tssv amount                   ➡️   number in Wei\n' +
      '\n]\n\n' +
      '\n--------------------------------------------------------------------------------\n' +
      `\n✳️  Transaction explained payload data: \n${explainedPayload}\n` +
      '\n--------------------------------------------------------------------------------\n' +
      `\n✳️  regiserValidator() Transaction raw payload data: \n\n${payload}\n`;

    await writeFile(payloadFilePath, message);
    return message + `\nTransaction details dumped to file: ${colors.bgYellow(colors.black(payloadFilePath))}\n`;
  }
}
