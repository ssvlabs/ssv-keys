import { readFile } from '../../lib/helpers';
import { BaseAction } from './BaseAction';

export class PrivateKeyAction extends BaseAction {
  static get options(): any {
    return {
      action: 'decrypt',
      shortAction: 'dec',
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
            }
          }
        },
        {
          arg1: '-ps',
          arg2: '--password',
          options: {
            required: true,
            type: String,
            help: 'Password for keystore'
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
    const data = await readFile(this.args.keystore);
    const privateKey = await this.ssvKeys.getPrivateKeyFromKeystoreData(data, this.args.password);
    return `Private key from keystore: ${privateKey}`;
  }
}
