import prompts from 'prompts';
import { ArgumentParser, SubParser } from 'argparse';
import { BaseAction } from './actions/BaseAction';

export class BaseCommand extends ArgumentParser {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions: any[] = [];

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
  protected interactive = false;

  /**
   * @param interactive if the command should be interactive instead of classic CLI
   * @param options argparse options
   */
  constructor(interactive= false, options = undefined) {
    super(options);
    this.interactive = interactive;
  }

  /**
   * Add actions sub-parsers.
   */
  addActionsSubParsers(): ArgumentParser {
    this.subParsers = this.add_subparsers(this.subParserOptions);
    for (const action of this.actions) {
      const actionOptions = action.options;
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
          const executable = new action();
          return executable.setArgs(args).execute();
        },
      });
      this.actionParsers[actionOptions.action] = actionParser;
    }
    return this;
  }

  /**
   * Interactively ask user for action
   */
  async askAction(): Promise<string> {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: `Select action`,
      choices: this.actions.map((action: BaseAction) => {
        return { title: action.options.action, value: action.options.action };
      }),
    });
    return response.action;
  }

  /**
   * Interactively ask user for action to execute, and it's arguments.
   * Populate process.argv with user input.
   */
  async executeInteractive(): Promise<any> {
    // Ask for action
    const selectedAction = await this.askAction();
    selectedAction || process.exit(1);
    process.argv.push(selectedAction);

    // Ask for all action arguments
    for (const action of this.actions) {
      if (action.options.action === selectedAction) {
        const actionOptions = action.options;
        for (const argument of actionOptions.arguments) {
          const message = argument.interactive?.options?.message || argument.options.help;
          const promptOptions = {
            ...argument.interactive?.options || {},
            type: argument.interactive?.options?.type || 'text',
            name: argument.interactive?.options?.name || argument.arg2,
            message,
          };
          if (argument.interactive?.repeat || 0 > 1) {
            const multi = [];
            const repeats = argument.interactive.repeat;
            for (let i = 1; i <= repeats; i++) {
              promptOptions.message = `${message}: ${i} from ${repeats}`;
              const response = await prompts(promptOptions);
              if (argument.required && !response[promptOptions.name]) {
                process.exit(1);
              }
              multi.push(response[promptOptions.name]);
            }
            process.argv.push(`${argument.arg2}=${multi.join(',')}`);
          } else {
            const response = await prompts(promptOptions);
            if (argument.required && !response[promptOptions.name]) {
              process.exit(1);
            }
            process.argv.push(`${argument.arg2}=${response[promptOptions.name]}`);
          }
        }
      }
    }
  }

  async execute(): Promise<void> {
    // Interactive execution
    if (this.interactive) {
      await this.executeInteractive();
    }

    // Non-interactive execution
    // Add actions
    this.addActionsSubParsers();
    // Execute action
    const args = this.parse_args();
    return args.func(args);
  }
}
