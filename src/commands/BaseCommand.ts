import { ArgumentParser, SubParser } from 'argparse';

export class BaseCommand extends ArgumentParser {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions: any = {}

  protected actionParsers: any = {}

  protected subParserOptions = {
    title: 'Actions',
    description: 'Possible actions',
    help: 'To get more detailed help: "<action> --help". ',
  }

  /**
   * Argparse sub parser to hold all the command actions options.
   * @protected
   */
  protected subParsers: SubParser | undefined;

  /**
   * Add actions sub-parsers.
   */
  addActionsSubParsers(): ArgumentParser {
    this.subParsers = this.add_subparsers(this.subParserOptions);
    for (const action of Object.keys(this.actions)) {
      const actionOptions = this.actions[action].options;
      const actionParser: ArgumentParser = this.subParsers.add_parser(
        actionOptions.action,
        {
          aliases: [actionOptions.shortAction]
        }
      );
      for (const argument of actionOptions.arguments) {
        actionParser.add_argument(argument.arg1, argument.arg2, argument.options);
      }
      actionParser.set_defaults({
        func: (args: any) => {
          const executable = new this.actions[actionOptions.action];
          return executable.setArgs(args).execute();
        },
      });
      this.actionParsers[action] = actionParser;
    }
    return this;
  }

  async execute(): Promise<void> {
    // Add actions
    this.addActionsSubParsers();
    // Execute action
    const args = this.parse_args();
    return args.func(args);
  }
}
