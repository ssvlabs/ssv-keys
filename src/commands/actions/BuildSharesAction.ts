import { writeFile } from '../../lib/helpers';
import { ISharesKeyPairs } from '../../lib/Threshold';
import { ActionOptions, BaseAction } from './BaseAction';

export class BuildSharesAction extends BaseAction {
  static get options(): ActionOptions {
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
          }
        },
        {
          arg1: '-pk',
          arg2: '--private-key',
          options: {
            type: String,
            required: true,
            help: 'Private key which you get using keystore and password'
          }
        },
        {
          arg1: '-o',
          arg2: '--output',
          options: {
            type: String,
            help: 'Write result as JSON to specified file'
          }
        }
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  async execute(): Promise<any> {
    const threshold: ISharesKeyPairs = await this.ssvKeys.createThreshold(this.args.private_key);
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
