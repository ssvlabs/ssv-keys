import { BaseCommand } from './BaseCommand';
import { KeySharesAction } from './actions/KeySharesAction';
import { BaseAction } from './actions/BaseAction';

export class SSVKeysCommand extends BaseCommand {
  protected actions = [KeySharesAction];
  protected useAction = 'shares';

  constructor(interactive = false) {
    super(interactive);
    BaseAction.helpFooter = 'To get more detailed help: "<action> --help". Example: "pnpm cli shares --help"';
  }
}
