import prompts from 'prompts';
import yargs, { Argv, Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { KeySharesAction } from './actions/KeySharesAction';

const ordinalSuffixOf = (i: number): string => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return i + 'st';
  if (j === 2 && k !== 12) return i + 'nd';
  if (j === 3 && k !== 13) return i + 'rd';
  return i + 'th';
};

export class BaseCommand {
  protected actions: (typeof KeySharesAction)[] = [];
  protected interactive = false;
  protected useAction: string | undefined;
  protected y: Argv;

  constructor(interactive = false) {
    this.interactive = interactive;
    this.y = yargs(hideBin(process.argv));
  }

  async addActionsSubParsers() {
    console.log('<<<<<<<<<<<<<<<<<<<this.actions>>>>>>>>>>>>>>>>>>>')
    console.log(this.actions)
    console.log('length = ' + this.actions.length)
    console.log('<<<<<<<<<<<<<<<<<<<this.actions>>>>>>>>>>>>>>>>>>>')
    for (const action of this.actions) {
      console.log(action)
      const actionOptions = action.options;
      console.log(actionOptions.action)
      console.log(actionOptions)
      this.y.command(
        actionOptions.action,
        actionOptions.description || '',
        (y: Argv) => {
          for (const argument of actionOptions.arguments) {
            y.option(argument.arg2.replace(/^--/, ''), argument.options);
          }
          return y;
        },
        async (argv: Arguments) => {
          const instance = new action();
          console.log(instance)
          await instance.setArgs(argv).execute();
        }
      );
    }
  }

  async askAction(): Promise<string> {
    if (this.useAction) return this.useAction;
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: `Select action`,
      choices: this.actions.map((action: typeof KeySharesAction) => ({
        title: action.options.description,
        value: action.options.action,
      })),
    });
    return response.action;
  }

  sanitizeArgument(arg: string): string {
    return arg.replace(/^(--)/gi, '').replace(/(-)/gi, '_').trim();
  }

  getPromptOptions(argument: any): any {
    const message = argument.interactive?.options?.message || argument.options.help;
    return {
      ...argument.interactive?.options || {},
      type: argument.interactive?.options?.type || 'text',
      name: this.sanitizeArgument(argument.arg2),
      message,
      onSubmit: argument.interactive?.onSubmit || undefined,
    };
  }

  getArgumentsForAction(userAction: string): any {
    for (const action of this.actions) {
      if (action.options.action === userAction) {
        return action.options.arguments;
      }
    }
    return [];
  }

  findArgumentByName(extraArgumentName: string, actionArguments: any[]): any {
    return actionArguments.find(arg => arg.arg2 === extraArgumentName) || null;
  }

  isPrefillFromArrayExists(dataIndex: number, promptOptions: any, preFilledValues: Record<string, any>): boolean {
    return !!preFilledValues[promptOptions.name]?.split(',')[dataIndex];
  }

  prefillFromArrayData(dataIndex: number, argument: any, promptOptions: any, preFilledValues: Record<string, any>) {
    let value = preFilledValues[promptOptions.name].split(',')[dataIndex];
    if (argument.interactive.options.type === 'number') {
      value = parseFloat(value);
      if (String(value).endsWith('.0')) value = parseInt(String(value), 10);
    }
    prompts.override({ ...preFilledValues, [promptOptions.name]: value });
  }

  async ask(promptOptions: any, extraOptions: any, required?: boolean): Promise<any> {
    let response: Record<string, any> = await prompts(promptOptions, extraOptions);
    while (required && !response[promptOptions.name]) {
      if (!Object.keys(response).includes(promptOptions.name)) process.exit(1);
      response = await prompts(promptOptions, extraOptions);
    }
    return response[promptOptions.name];
  }

  async executeInteractive(): Promise<void> {
    const selectedAction = await this.askAction();
    if (!selectedAction) process.exit(1);
    const preFilledValues: Record<string, any> = {};
    process.argv = [process.argv[0], process.argv[1], selectedAction];

    const processedArgs: any = {};
    const actionArguments = this.getArgumentsForAction(selectedAction);
    const multi: any = {};

    for (const argument of actionArguments) {
      if (!argument.interactive) continue;

      const promptOptions = this.getPromptOptions(argument);
      if (processedArgs[promptOptions.name]) continue;

      processedArgs[promptOptions.name] = true;
      const message = promptOptions.message;
      const extraOptions = { onSubmit: promptOptions.onSubmit };

      let isRepeatable = !!argument.interactive?.repeat;
      if (!isRepeatable) {
        multi[promptOptions.name] = [await this.ask(promptOptions, extraOptions)];
        continue;
      }

      let repeatCount = 0;
      multi[promptOptions.name] = [];

      while (isRepeatable) {
        promptOptions.message = `${message}`.replace('{{index}}', ordinalSuffixOf(repeatCount + 1));
        multi[promptOptions.name].push(await this.ask(promptOptions, extraOptions));

        let filledAsParent = false;
        for (const extraName of argument.interactive.repeatWith) {
          const extraArg = this.findArgumentByName(extraName, actionArguments);
          if (!extraArg) continue;

          const extraPrompt = this.getPromptOptions(extraArg);
          extraPrompt.message = extraPrompt.message.replace('{{index}}', ordinalSuffixOf(repeatCount + 1));
          multi[extraPrompt.name] = multi[extraPrompt.name] || [];
          multi[extraPrompt.name].push(await this.ask(extraPrompt, { onSubmit: extraPrompt.onSubmit }));
          processedArgs[extraPrompt.name] = true;

          if (multi[extraPrompt.name].length === preFilledValues[promptOptions.name]?.split(',').length) {
            filledAsParent = true;
          }
        }

        if (filledAsParent || !this.isPrefillFromArrayExists(repeatCount + 1, promptOptions, preFilledValues)) {
          isRepeatable = (await prompts({ type: 'confirm', name: 'value', message: argument.interactive?.repeat, initial: true })).value;
        }

        repeatCount++;
      }

      if (argument.interactive?.validateList) {
        argument.interactive.validateList(multi[promptOptions.name]);
      }
    }

    for (const key of Object.keys(multi)) {
      process.argv.push(`--${key.replace(/_/g, '-')}` + '=' + multi[key].join(','));
    }
  }

  async execute(): Promise<void> {
    if (this.interactive) {

      await this.executeInteractive();
    }
    await this.addActionsSubParsers();
    await this.y.parse();
  }
}
