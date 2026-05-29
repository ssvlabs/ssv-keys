import { BaseCommand } from "./BaseCommand";
import { KeySharesAction } from "./actions/KeySharesAction";
import { NonceAction } from "./actions/NonceAction";
import { ClusterAction } from "./actions/ClusterAction";
import { OperatorAction } from "./actions/OperatorAction";

export class SSVKeysCommand extends BaseCommand {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions = [KeySharesAction, NonceAction, ClusterAction, OperatorAction];

  /**
   * Add more specific help.
   */
  constructor(interactive = false, options = undefined) {
    super(interactive, options);
    this.subParserOptions.help += 'Example: "pnpm cli shares --help"';
  }
}
