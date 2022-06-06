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
        return { title: action.options.description, value: action.options.action };
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

    const processedArguments: any = {};
    const actionArguments = this.getArgumentsForAction(selectedAction);
    for (const argument of actionArguments) {
      const multi: any = {};
      const repeats = argument.interactive?.repeat || 1;
      const promptOptions = this.getPromptOptions(argument);
      if (processedArguments[promptOptions.name]) {
        continue;
      }
      processedArguments[promptOptions.name] = true;
      const message = promptOptions.message;
      const extraOptions = { onSubmit: promptOptions.onSubmit };

      for (let i = 1; i <= repeats; i++) {
        promptOptions.message = repeats > 1 ? `${message}: ${i} from ${repeats}` : message;
        const response = await prompts(promptOptions, extraOptions);
        this.assertRequired(argument, response[promptOptions.name]);
        multi[promptOptions.name] = multi[promptOptions.name] || [];
        multi[promptOptions.name].push(response[promptOptions.name]);

        // Processing "repeatWith".
        // For cases when some parameters are relative to each other and should be
        // asked from user in a relative way.
        if (repeats > 1 && argument.interactive?.repeatWith) {
          for (const extraArgumentName of argument.interactive.repeatWith) {
            const extraArgument = this.findArgumentByName(extraArgumentName, actionArguments);
            if (!extraArgument) {
              continue;
            }
            // Build extra argument options
            const extraArgumentPromptOptions = this.getPromptOptions(extraArgument);
            if (processedArguments[extraArgumentPromptOptions.name]
              && processedArguments[extraArgumentPromptOptions.name] === repeats) {
              continue;
            }
            const extraArgumentMessage = extraArgumentPromptOptions.message;
            const extraArgumentOptions = { onSubmit: extraArgumentPromptOptions.onSubmit };
            extraArgumentPromptOptions.message = `${extraArgumentMessage}: ${i} from ${repeats}`;

            // Prompt extra argument
            const response = await prompts(extraArgumentPromptOptions, extraArgumentOptions);
            this.assertRequired(extraArgument, response[extraArgumentPromptOptions.name]);
            multi[extraArgumentPromptOptions.name] = multi[extraArgumentPromptOptions.name] || [];
            multi[extraArgumentPromptOptions.name].push(response[extraArgumentPromptOptions.name]);
            processedArguments[extraArgumentPromptOptions.name] = processedArguments[extraArgumentPromptOptions.name] || 0;
            processedArguments[extraArgumentPromptOptions.name] += 1;
          }
        }
      }
      for (const argumentName of Object.keys(multi)) {
        process.argv.push(`${argumentName}=${multi[argumentName].join(',')}`);
      }
    }
  }

  /**
   * Find argument in list of arguments by its arg2 value.
   * @param extraArgumentName
   * @param actionArguments
   */
  findArgumentByName(extraArgumentName: string, actionArguments: any[]): any {
    for (const argument of actionArguments) {
      if (extraArgumentName === argument.arg2) {
        return argument;
      }
    }
    return null;
  }

  /**
   * Returns list of arguments for selected user action
   * @param userAction
   */
  getArgumentsForAction(userAction: string): any {
    for (const action of this.actions) {
      if (action.options.action === userAction) {
        return action.options.arguments;
      }
    }
    return null;
  }

  /**
   * Compile final prompt options
   * @param argument
   */
  getPromptOptions(argument: any): any {
    const message = argument.interactive?.options?.message || argument.options.help;
    return {
      ...argument.interactive?.options || {},
      type: argument.interactive?.options?.type || 'text',
      name: argument.arg2,
      message,
      onSubmit: argument.interactive.onSubmit || undefined,
    };
  }

  /**
   * If argument is required but value didn't provide by user - exit process with error code.
   * @param argument
   * @param value
   */
  assertRequired(argument: any, value: any) {
    if (argument.options.required && !value) {
      console.error(`Parameter is required: ${argument.interactive?.options?.message || argument.options.help}`);
      process.exit(1);
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
