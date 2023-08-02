import { BaseCommand } from './BaseCommand';
import { KeySharesAction } from './actions/KeySharesAction';
import { KeySharesCustomBulkAction } from './actions/KeySharesCustomBulkAction';

export class SSVKeysCommand extends BaseCommand {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions = [
    KeySharesAction,
    KeySharesCustomBulkAction,
  ]

  protected useAction = 'shares';

  /**
   * Add more specific help.
   */
  constructor(interactive= false, defaultAction?: string, options = undefined) {
    super(interactive, options);
    if (defaultAction) this.useAction = defaultAction;
    this.subParserOptions.help += 'Example: "yarn cli shares --help"'
  }
}
