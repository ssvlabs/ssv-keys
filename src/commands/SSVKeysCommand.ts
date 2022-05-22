import { BaseCommand } from './BaseCommand';
import { PrivateKeyAction } from './actions/PrivateKeyAction';
import { BuildSharesAction } from './actions/BuildSharesAction';
import { BuildTransactionAction } from './actions/BuildTransactionAction';
import { BuildTransactionV2Action } from './actions/BuildTransactionV2Action';

export class SSVKeysCommand extends BaseCommand {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions = [
    PrivateKeyAction,
    BuildSharesAction,
    BuildTransactionAction,
    BuildTransactionV2Action,
  ]

  /**
   * Add more specific help.
   */
  constructor() {
    super();
    this.subParserOptions.help += 'Example: "ssv-keys decrypt --help" or "ssv-keys dec --help"'
  }
}
