import { decode } from 'js-base64';
import { BaseAction } from './BaseAction';
import { writeFile } from '../../lib/helpers';
import { ISharesKeyPairs } from '../../lib/Threshold';

export class BuildSharesAction extends BaseAction {
  static get options(): any {
    return {
      action: 'shares',
      shortAction: 'sh',
      arguments: [
        {
          arg1: '-op',
          arg2: '--operators',
          options: {
            type: String,
            required: true,
            help: 'Comma-separated list of base64 operator keys. ' +
                  'Require at least 4 operators'
          },
          interactive: {
            repeat: 4,
            options: {
              type: 'text',
              message: 'Operator base64 encoded public key',
              /**
               * Basic (not deep) validation of RSA key
               * @param operator
               */
              validate: (operator: string) => {
                try {
                  const decodedOperator = decode(operator);
                  if (!decodedOperator.startsWith('-----BEGIN RSA PUBLIC KEY-----')) {
                    throw Error('Not valid RSA key');
                  }
                  return true;
                } catch (e) {
                  return 'Only valid base64 string is allowed';
                }
              }
            }
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
            help: 'Write result as JSON to specified file'
          },
          interactive: {
            options: {
              type: 'text',
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
    const { private_key : privateKey } = this.args;
    const threshold: ISharesKeyPairs = await this.ssvKeys.createThreshold(privateKey);
    const shares = await this.ssvKeys.encryptShares(this.args.operators.split(','), threshold.shares);
    const sharesJson = JSON.stringify(shares, null, '  ');
    let sharesMessage = `Shares: \n${sharesJson}`;
    if (this.args.output) {
      await writeFile(this.args.output, sharesJson);
      sharesMessage = `${sharesMessage}\n\nDumped to: ${this.args.output}`;
    }
    return `${sharesMessage}`
  }
}
