import colors from 'colors/safe';
import { BaseAction } from './BaseAction';
import { readFile } from '../../lib/helpers';
import { fileExistsValidator } from './validators/file';

export class PrivateKeyAction extends BaseAction {
  static get options(): any {
    return {
      action: 'decrypt',
      shortAction: 'dec',
      description: 'Decrypt keystore using password and get private key from it',
      arguments: [
        {
          arg1: '-ks',
          arg2: '--keystore',
          options: {
            required: true,
            type: String,
            help: 'Provide your keystore file path',
          },
          interactive: {
            options: {
              type: 'text',
              validate: fileExistsValidator
            }
          }
        },
        {
          arg1: '-ps',
          arg2: '--password',
          options: {
            required: true,
            type: String,
            help: 'Enter password for keystore to decrypt it and get private key'
          },
          interactive: {
            options: {
              type: 'password',
            }
          }
        }
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  async execute(): Promise<any> {
    const data = await readFile(String(this.args.keystore).trim());
    const privateKey = await this.ssvKeys.getPrivateKeyFromKeystoreData(data, this.args.password);
    return `\n\n\tPrivate key from keystore ➡️  ${colors.bgYellow(colors.black(privateKey))}\n\n` +
      '\t' + colors.bgRed(colors.white('#########################################\n')) +
      '\t' + colors.bgRed(colors.white('########### ⚠️  PLEASE NOTICE  ###########\n')) +
      '\t' + colors.bgRed(colors.white('#########################################\n')) +
      '\t' + colors.bgRed(colors.white('# KEEP YOUR PRIVATE KEY SAFE AND SECRET #\n')) +
      '\t' + colors.bgRed(colors.white('#       NEVER GIVE IT TO ANYONE!!!      #\n')) +
      '\t' + colors.bgRed(colors.white('#########################################\n'));
  }
}
