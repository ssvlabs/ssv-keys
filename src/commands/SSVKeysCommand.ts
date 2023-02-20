import { BaseCommand } from './BaseCommand';
import { KeySharesAction } from './actions/KeySharesAction';

export class SSVKeysCommand extends BaseCommand {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions = [
    KeySharesAction,
  ]

  protected useAction = 'shares';

  /**
   * Add more specific help.
   */
  constructor(interactive= false, options = undefined) {
    super(interactive, options);
    this.subParserOptions.help += 'Example: "yarn cli shares --help"'
  }
}
