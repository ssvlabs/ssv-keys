import prompts from 'prompts';
import { ArgumentParser, SubParser } from 'argparse';
import { BaseAction } from './actions/BaseAction';

const ordinalSuffixOf = (i: number): string => {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
};

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
  protected useAction: string | undefined;

  /**
   * @param interactive if the command should be interactive instead of classic CLI
   * @param options argparse options
   */
  constructor(interactive = false, options = undefined) {
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
    // Skip asking action
    if (this.useAction) {
      return this.useAction;
    }
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
   * Pre-fill all values from arguments of executable
   * @param selectedAction
   * @param clearProcessArgs
   */
  prefillFromArguments(selectedAction: string, clearProcessArgs?: boolean): Record<string, any> {
    const actionArguments = this.getArgumentsForAction(selectedAction);
    const parser = new ArgumentParser();
    const [, args] = parser.parse_known_args();
    const parsedArgs: Record<string, any> = {};
    for (const arg of args) {
      const argData = arg.split('=');
      // Find short arg1 and replace with long arg2
      for (const argument of actionArguments) {
        if (argData[0] === argument.arg1) {
          argData[0] = argument.arg2;
          break;
        }
      }
      const argumentName = this.sanitizeArgument(argData[0]);
      parsedArgs[argumentName] = String(argData[1]).trim();
    }
    parsedArgs['action'] = selectedAction;
    prompts.override(parsedArgs);
    if (clearProcessArgs) {
      process.argv = [process.argv[0], process.argv[1]];
    }
    return parsedArgs;
  }

  isPrefillFromArrayExists(dataIndex: number, promptOptions: any, preFilledValues: Record<string, any>): boolean {
    return !!preFilledValues[promptOptions.name]?.split(',')[dataIndex];
  }
  /**
   * Pre-fill prompts from array data on specific index
   * @param dataIndex
   * @param argument
   * @param promptOptions
   * @param preFilledValues
   */
  prefillFromArrayData(dataIndex: number, argument: any, promptOptions: any, preFilledValues: Record<string, any>) {
    let preFilledValue = preFilledValues[promptOptions.name].split(',')[dataIndex];
    if (argument.interactive.options.type === 'number') {
      preFilledValue = parseFloat(preFilledValue);
      if (String(preFilledValue).endsWith('.0')) {
        preFilledValue = parseInt(String(preFilledValue), 10);
      }
    }
    const override = {
      ...preFilledValues,
      [promptOptions.name]: preFilledValue
    };
    prompts.override(override);
  }

  async ask(promptOptions: any, extraOptions: any, required?: boolean): Promise<any> {
    let response: Record<string, any> = {};
    response = await prompts(promptOptions, extraOptions);
    while (required && !response[promptOptions.name]) {
      if (Object.keys(response).indexOf(promptOptions.name) === -1) {
        process.exit(1);
      }
      response = await prompts(promptOptions, extraOptions);
    }
    return response[promptOptions.name];
  }

  /**
   * Interactively ask user for action to execute, and it's arguments.
   * Populate process.argv with user input.
   */
  async executeInteractive(): Promise<any> {
    // Ask for action
    const selectedAction = await this.askAction();
    selectedAction || process.exit(1);
    const preFilledValues = this.prefillFromArguments(selectedAction, true);
    process.argv.push(selectedAction);
    const processedArguments: any = {};
    const actionArguments = this.getArgumentsForAction(selectedAction);
    const multi: any = {};
    for (const argument of actionArguments) {
      if (!argument.interactive) continue;
      const promptOptions = this.getPromptOptions(argument);
      if (processedArguments[promptOptions.name]) {
        continue;
      }
      processedArguments[promptOptions.name] = true;

      const message = promptOptions.message;
      const extraOptions = { onSubmit: promptOptions.onSubmit };
      let isRepeatable = !!argument.interactive?.repeat;
      if (!isRepeatable) {
        multi[promptOptions.name] = multi[promptOptions.name] || [];
        multi[promptOptions.name].push(await this.ask(promptOptions, extraOptions));
      }
      let repeatCount =  0;
      while (isRepeatable) {
        // Build pre-filled value for parent repeat
        if (preFilledValues[promptOptions.name]) {
          this.prefillFromArrayData(repeatCount, argument, promptOptions, preFilledValues);
        }
        promptOptions.message = `${message}`.replace('{{index}}', `${ordinalSuffixOf(repeatCount + 1)}`);
        multi[promptOptions.name] = multi[promptOptions.name] || [];
        multi[promptOptions.name].push(await this.ask(promptOptions, extraOptions));
        // Processing "repeatWith".
        // For cases when some parameters are relative to each other and should be
        // asked from user in a relative way.
        let filledAsParent = false;
        for (const extraArgumentName of argument.interactive.repeatWith) {
          const extraArgument = this.findArgumentByName(extraArgumentName, actionArguments);
          if (!extraArgument) {
            continue;
          }
          // Build extra argument options
          const extraArgumentPromptOptions = this.getPromptOptions(extraArgument);
          const extraArgumentMessage = extraArgumentPromptOptions.message;
          const extraArgumentOptions = { onSubmit: extraArgumentPromptOptions.onSubmit };

          // Build pre-filled value for child repeat
          if (preFilledValues[extraArgumentPromptOptions.name]) {
            this.prefillFromArrayData(repeatCount, extraArgument, extraArgumentPromptOptions, preFilledValues);
          }
          extraArgumentPromptOptions.message = `${extraArgumentMessage}`.replace('{{index}}', `${ordinalSuffixOf(repeatCount + 1)}`);

          // Prompt extra argumen
          multi[extraArgumentPromptOptions.name] = multi[extraArgumentPromptOptions.name] || [];
          multi[extraArgumentPromptOptions.name].push(await this.ask(extraArgumentPromptOptions, extraArgumentOptions));
          processedArguments[extraArgumentPromptOptions.name] = true;

          if (preFilledValues[promptOptions.name] && preFilledValues[promptOptions.name].split(',').length === multi[extraArgumentPromptOptions.name].length) {
            filledAsParent = true;
          }
        }

        if (filledAsParent) {
          isRepeatable = false;
        } else if (!this.isPrefillFromArrayExists(repeatCount + 1, promptOptions, preFilledValues)) {
          isRepeatable = (await prompts({ type: 'confirm', name: 'value', message: argument.interactive?.repeat, initial: true })).value;
        }
        repeatCount++;
      }

      // if end of repeat logic, need to validate the list if validator exists
      if (argument.interactive?.repeat && argument.interactive?.validateList) {
        argument.interactive?.validateList(multi[promptOptions.name]);
      }
    }
    for (const argumentName of Object.keys(multi)) {
      process.argv.push(`--${argumentName.replace(/(_)/gi, '-')}=${multi[argumentName].join(',')}`);
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
   * Make an argument name useful for the flow
   * @param arg
   * @protected
   */
  protected sanitizeArgument(arg: string): string {
    return arg
      .replace(/^(--)/gi, '')
      .replace(/(-)/gi, '_')
      .trim();
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
      name: this.sanitizeArgument(argument.arg2),
      message,
      onSubmit: argument.interactive.onSubmit || undefined,
    };
  }

  async execute(): Promise<any> {
    // Interactive execution
    if (this.interactive) {
      await this.executeInteractive();
    }

    // Non-interactive execution
    // Add actions
    this.addActionsSubParsers();
    // Execute action
    const args = this.parse_args();
    if (!args.func) {
      this.print_help();
      return;
    }
    return args.func(args);
  }
}
