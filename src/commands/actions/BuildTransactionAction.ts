import colors from 'colors/safe';
import { encode } from 'js-base64';
import { BaseAction } from './BaseAction';
import { ISharesKeyPairs } from '../../lib/Threshold';
import { fileExistsValidator } from './validators/file';
import { operatorValidator } from './validators/operator';
import { EncryptShare } from '../../lib/Encryption/Encryption';
import { getFilePath, readFile, writeFile } from '../../lib/helpers';
import { KeystorePasswordValidator } from './validators/keystore-password';

const keystorePasswordValidator = new KeystorePasswordValidator();

export class BuildTransactionAction extends BaseAction {
  static get options(): any {
    return {
      action: 'transaction',
      shortAction: 'tr',
      description: 'Build shares for list of operators using private key from keystore. Then build final transaction using those shares.',
      arguments: [
        {
          arg1: '-ks',
          arg2: '--keystore',
          options: {
            required: true,
            type: String,
            help: 'Keystore file path'
          },
          interactive: {
            options: {
              type: 'text',
              validate: (filePath: string): boolean | string => {
                const isValid = fileExistsValidator(filePath);
                if (isValid === true) {
                  keystorePasswordValidator.setKeystoreFilePath(String(filePath).trim());
                }
                return isValid;
              },
            }
          }
        },
        {
          arg1: '-ps',
          arg2: '--password',
          options: {
            required: true,
            type: String,
            help: 'Password for keystore to decrypt it and get private key'
          },
          interactive: {
            options: {
              type: 'password',
              validate: (password: string) => {
                return keystorePasswordValidator.validatePassword(password);
              },
            }
          }
        },
        {
          arg1: '-op',
          arg2: '--operators',
          options: {
            type: String,
            required: true,
            help: 'Comma-separated list of base64 operator keys. Require at least 4 operators'
          },
          interactive: {
            repeat: 4,
            options: {
              type: 'text',
              message: 'Operator base64 encoded public key',
              validate: operatorValidator
            }
          }
        },
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  async execute(): Promise<any> {
    const { keystore, password } = this.args;

    // Step 1: read keystore file
    const data = await readFile(String(keystore).trim());

    // Step 2: decrypt keystore file and get private key
    const privateKey = await this.ssvKeys.getPrivateKeyFromKeystoreData(data, password);

    // Step 3: build shares in raw format
    const threshold: ISharesKeyPairs = await this.ssvKeys.createThreshold(privateKey);
    let shares = await this.ssvKeys.encryptShares(this.args.operators.split(','), threshold.shares);
    shares = shares.map((share: EncryptShare) => {
      share.operatorPublicKey = encode(share.operatorPublicKey);
      return share;
    });

    // Step 4: build payload using encrypted shares
    const payload = await this.ssvKeys.buildPayload(privateKey, shares);
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

    const payloadFilePath = await getFilePath('payload');
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
      `\n✳️  Transaction raw payload data: \n\n${payload}\n`;

    await writeFile(payloadFilePath, message);
    return message + `\nTransaction details dumped to file: ${colors.bgYellow(colors.black(payloadFilePath))}\n`;
  }
}
