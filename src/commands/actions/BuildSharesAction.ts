import colors from 'colors/safe';
import { encode } from 'js-base64';
import { BaseAction } from './BaseAction';
import { ISharesKeyPairs } from '../../lib/Threshold';
import { fileExistsValidator } from './validators/file';
import { operatorValidator } from './validators/operator';
import { EncryptShare } from '../../lib/Encryption/Encryption';
import { writeFile, readFile, getFilePath } from '../../lib/helpers';

export class BuildSharesAction extends BaseAction {
  static get options(): any {
    return {
      action: 'shares',
      shortAction: 'sh',
      description: 'Build shares for list of operators using private key from keystore',
      arguments: [
        {
          arg1: '-ks',
          arg2: '--keystore',
          options: {
            required: true,
            type: String,
            help: 'Provide your keystore file path'
          },
          interactive: {
            options: {
              type: 'text',
              validate: fileExistsValidator,
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
        },
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
              validate: operatorValidator
            }
          }
        },
        {
          arg1: '-of',
          arg2: '--output-format',
          options: {
            type: String,
            required: true,
            default: 'abi',
            help: 'Format of result: "abi" or "raw". By default: "abi"'
          },
          interactive: {
            options: {
              type: 'select',
              message: 'Select format to print shares in',
              choices: [
                { title: 'Encoded ABI', description: 'Result will be encoded in ABI format', value: 'abi' },
                { title: 'Raw data', description: 'Result will be printed in a raw format', value: 'raw' },
              ],
              initial: 0
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
    // Step 1: read keystore file
    const { keystore, password, output_format: outputFormat } = this.args;
    const data = await readFile(String(keystore).trim());

    // Step 2: decrypt private key using keystore file and password
    const privateKey = await this.ssvKeys.getPrivateKeyFromKeystoreData(data, password);

    // Step 3: Build shares for provided operators list
    const threshold: ISharesKeyPairs = await this.ssvKeys.createThreshold(privateKey);
    let shares = await this.ssvKeys.encryptShares(this.args.operators.split(','), threshold.shares);
    shares = shares.map((share: EncryptShare) => {
      share.operatorPublicKey = encode(share.operatorPublicKey);
      if (outputFormat === 'abi') {
        share.operatorPublicKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.operatorPublicKey);
        share.privateKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.privateKey);
      }
      return share;
    });

    // Print out result and dump shares into file
    const sharesJson = JSON.stringify(shares, null, '  ');
    let sharesMessage = `Shares: \n${sharesJson}`;
    const sharesFilePath = await getFilePath('shares');
    await writeFile(sharesFilePath, sharesJson);
    sharesMessage = `${sharesMessage}\n\nShares dumped to file: ${colors.bgYellow(colors.black(sharesFilePath))}`;
    return `${sharesMessage}`
  }
}
