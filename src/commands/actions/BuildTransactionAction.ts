import { BaseAction } from './BaseAction';
import { readFile, writeFile } from '../../lib/helpers';
import { EncryptShare } from '../../lib/Encryption/Encryption';

export class BuildTransactionAction extends BaseAction {
  static get options(): any {
    return {
      action: 'transaction',
      shortAction: 'tr',
      arguments: [
        {
          arg1: '-sh',
          arg2: '--shares',
          options: {
            help: 'File path to shares JSON dumped before'
          }
        },
        {
          arg1: '-pk',
          arg2: '--private-key',
          options: {
            type: String,
            required: true,
            help: 'Private key which you get using keystore and password'
          },
          interactive: {
            options: {
              type: 'password',
            }
          }
        },
        {
          arg1: '-o',
          arg2: '--output',
          options: {
            type: String,
            help: 'Write explained result into text file if necessary'
          }
        }
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  async execute(): Promise<any> {
    const { shares, private_key : privateKey } = this.args;
    const encryptedShares: EncryptShare[] = await readFile(shares, true);
    const payload = await this.ssvKeys.buildPayload(privateKey, encryptedShares);
    const explainedPayload = '' +
      '\n[\n' +
      `\n\t validator public key   ➡️   ${payload[0]}\n` +
      '\n\t operators public keys  ➡️   array[\n' +
      payload[1].map((publicKey: string, index: number) => `\n\t                                   [${index}]: ${publicKey}\n`).join('') +
      '                                 ]\n' +
      '\n\t share public keys      ➡️   array[\n' +
      payload[2].map((publicKey: string, index: number) => `\n\t                                   [${index}]: ${publicKey}\n`).join('') +
      '                                 ]\n' +
      '\n\t share private keys     ➡️   array[\n' +
      payload[3].map((privateKey: string, index: number) => `\n\t                                   [${index}]: ${privateKey}\n`).join('') +
      '                                 ]\n' +
      '\n]\n';

    const message = '✳️  Transaction payload have the following structure encoded as ABI Params: \n' +
                    '\n[\n' +
                    '\n\tthreshold.validatorPublicKey ➡️   String\n' +
                    '\n\toperatorsPublicKeys          ➡️   array[<operator public key>, ..., <operator public key>]\n' +
                    '\n\tsharePublicKeys              ➡️   array[<share public key>,    ..., <share public key>]\n' +
                    '\n\tsharePrivateKeys             ➡️   array[<share private key>,   ..., <share private key>]\n' +
                    '\n]\n\n' +
                    '\n--------------------------------------------------------------------------------\n' +
                    `\n✳️  Transaction explained payload data: \n${explainedPayload}\n` +
                    '\n--------------------------------------------------------------------------------\n' +
                    `\n✳️  Transaction raw payload data: \n\n${payload}`;
    if (this.args.output) {
      await writeFile(this.args.output, message);
    }
    return message;
  }
}
