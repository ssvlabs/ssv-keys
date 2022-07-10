import colors from 'colors/safe';
import { encode } from 'js-base64';
import { BaseAction } from './BaseAction';
import { ISharesKeyPairs } from '../../lib/Threshold';
import { operatorValidator } from './validators/operator';
import { EncryptShare } from '../../lib/Encryption/Encryption';
import { writeFile, readFile, getFilePath } from '../../lib/helpers';
import { fileExistsValidator, jsonFileValidator } from './validators/file';
import { KeystorePasswordValidator } from './validators/keystore-password';

const keystorePasswordValidator = new KeystorePasswordValidator();

export type IDispatchResult = {
  privateKey: string,
  keystore: string,
  password: string,
  operatorsIds: number[],
  operators: string[],
  shares: EncryptShare[],
  threshold: ISharesKeyPairs
};

export class BuildSharesAction extends BaseAction {
  static KEYSTORE_ARGUMENT = {
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
          filePath = String(filePath).trim();
          let isValid = fileExistsValidator(filePath);
          if (isValid !== true) {
            return isValid;
          }
          isValid = jsonFileValidator(filePath);
          if (isValid !== true) {
            return isValid;
          }
          keystorePasswordValidator.setKeystoreFilePath(String(filePath).trim());
          return true;
        },
      }
    }
  };

  static PASSWORD_ARGUMENT = {
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
  };

  static OPERATORS_PUBLIC_KEYS_ARGUMENT = {
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
      repeatWith: [
        '--operators-ids'
      ],
      options: {
        type: 'text',
        message: 'Operator base64 encoded public key',
        validate: operatorValidator
      }
    }
  };

  static OPERATORS_IDS_ARGUMENT = {
    arg1: '-oid',
    arg2: '--operators-ids',
    options: {
      type: String,
      required: true,
      help: 'Comma-separated list of operators IDs from the contract in the same sequence as you provided operators itself'
    },
    interactive: {
      repeat: 4,
      options: {
        type: 'number',
        message: 'Operator ID from the contract',
        validate: (operatorId: number) => {
          return !(Number.isInteger(operatorId) && operatorId > 0) ? 'Operator ID should be positive integer number' : true;
        }
      }
    }
  };

  static OUTPUT_FORMAT_ARGUMENT = {
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
  };

  static get options(): any {
    return {
      action: 'shares',
      shortAction: 'sh',
      description: 'Generate shares for a list of operators from a validator keystore file',
      arguments: [
        BuildSharesAction.KEYSTORE_ARGUMENT,
        BuildSharesAction.PASSWORD_ARGUMENT,
        BuildSharesAction.OPERATORS_PUBLIC_KEYS_ARGUMENT,
        BuildSharesAction.OPERATORS_IDS_ARGUMENT,
        BuildSharesAction.OUTPUT_FORMAT_ARGUMENT,
      ],
    }
  }

  /**
   * Decrypt and return private key.
   */
  async execute(): Promise<any> {
    const { shares } = await this.dispatch();

    // Print out result and dump shares into file
    const sharesJson = JSON.stringify(shares, null, '  ');
    let sharesMessage = `Shares: \n${sharesJson}`;
    const sharesFilePath = await getFilePath('shares');
    await writeFile(sharesFilePath, sharesJson);
    sharesMessage = `${sharesMessage}\n\nShares dumped to file: ${colors.bgYellow(colors.black(sharesFilePath))}`;
    return `${sharesMessage}`
  }

  async dispatch(): Promise<IDispatchResult> {
    const {
      keystore,
      password,
      output_format: outputFormat,
    } = this.args;
    let { operators_ids: operatorsIds, operators } = this.args;

    operators = operators.split(',');
    operatorsIds = operatorsIds.split(',').map((o: string) => parseInt(o, 10));

    // Step 1: read keystore file
    const data = await readFile(String(keystore).trim());

    // Step 2: decrypt private key using keystore file and password
    const privateKey = await this.ssvKeys.getPrivateKeyFromKeystoreData(data, password);

    // Step 3: Build shares for provided operators list
    const threshold: ISharesKeyPairs = await this.ssvKeys.createThreshold(privateKey, operatorsIds);
    let shares = await this.ssvKeys.encryptShares(operators, threshold.shares);
    shares = shares.map((share: EncryptShare) => {
      share.operatorPublicKey = encode(share.operatorPublicKey);
      if (outputFormat === 'abi') {
        share.operatorPublicKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.operatorPublicKey);
        share.privateKey = this.ssvKeys.getWeb3().eth.abi.encodeParameter('string', share.privateKey);
      }
      return share;
    });

    return {
      privateKey,
      keystore,
      password,
      operatorsIds,
      operators,
      shares,
      threshold,
    }
  }
}
