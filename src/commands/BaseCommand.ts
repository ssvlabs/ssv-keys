import prompts from "prompts";
import {
  ArgumentParser,
  Namespace,
  RawDescriptionHelpFormatter,
  SubParser,
} from "argparse";
import path from "path";
import type {
  ActionArgument,
  ActionClass,
  CompiledPromptOptions,
  PromptValues,
} from "./types";

const ordinalSuffixOf = (i: number): string => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) {
    return `${i}st`;
  }
  if (j === 2 && k !== 12) {
    return `${i}nd`;
  }
  if (j === 3 && k !== 13) {
    return `${i}rd`;
  }
  return `${i}th`;
};

const HELP_MAX_POSITION = 56;

const RawDescriptionHelpFormatterCtor =
  RawDescriptionHelpFormatter as unknown as {
    new (options?: Record<string, unknown>): {
      [key: string]: unknown;
    };
  };

class AlignedHelpFormatter extends RawDescriptionHelpFormatterCtor {
  constructor(options: Record<string, unknown> = {}) {
    super({
      ...options,
      max_help_position: HELP_MAX_POSITION,
    });
  }
}

export class BaseCommand extends ArgumentParser {
  /**
   * List of all supported command actions.
   * @protected
   */
  protected actions: ActionClass[] = [];

  protected subParserOptions = {
    title: "Actions",
    description: "Possible actions",
    metavar: "COMMAND",
    help: 'To get more detailed help: "<action> --help". ',
  };

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
  constructor(
    interactiveOrOptions: boolean | Record<string, unknown> = false,
    options: Record<string, unknown> | undefined = undefined
  ) {
    let interactive = false;
    let parserOptions = options;

    if (typeof interactiveOrOptions === "boolean") {
      interactive = interactiveOrOptions;
    } else {
      parserOptions = interactiveOrOptions;
    }

    super(parserOptions);
    this.interactive = interactive;
  }

  /**
   * Add actions sub-parsers.
   */
  addActionsSubParsers(): ArgumentParser {
    this.subParsers = this.add_subparsers(this.subParserOptions);

    for (const action of this.actions) {
      const actionOptions = action.options;
      const actionParser = this.subParsers.add_parser(actionOptions.action, {
        help: actionOptions.description || "",
        description: actionOptions.description || "",
        epilog: actionOptions.example || "",
        formatter_class: AlignedHelpFormatter,
      });

      for (const argument of actionOptions.arguments) {
        actionParser.add_argument(argument.arg1, argument.arg2, argument.options);
      }

      actionParser.set_defaults({
        func: (args: Namespace) => {
          const executable = new action();
          return executable.setArgs(args).execute();
        },
      });
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

    const response = (await prompts({
      type: "select",
      name: "action",
      message: "Select action",
      choices: this.actions.map((action) => {
        return {
          title: action.options.description || "",
          value: action.options.action || "",
        };
      }),
    })) as { action?: string };

    return response.action || "";
  }

  /**
   * Pre-fill all values from arguments of executable
   * @param selectedAction
   * @param clearProcessArgs
   */
  prefillFromArguments(
    selectedAction: string,
    clearProcessArgs?: boolean
  ): PromptValues {
    const actionArguments = this.getArgumentsForAction(selectedAction);
    const parser = new ArgumentParser();
    const [, args] = parser.parse_known_args();
    const parsedArgs: PromptValues = {};

    for (const arg of args) {
      const argData = arg.split("=");

      // Find short arg1 and replace with long arg2
      for (const argument of actionArguments) {
        if (argData[0] === argument.arg1) {
          argData[0] = argument.arg2;
          break;
        }
      }

      const argumentName = this.sanitizeArgument(argData[0]);
      const argumentValue = argData.slice(1).join("=");
      parsedArgs[argumentName] = String(argumentValue).trim();
    }

    parsedArgs.action = selectedAction;
    prompts.override(parsedArgs as Record<string, unknown>);

    if (clearProcessArgs) {
      process.argv = [process.argv[0], process.argv[1]];
    }

    return parsedArgs;
  }

  private getPrefillArrayValue(
    preFilledValues: PromptValues,
    fieldName: string,
    dataIndex: number
  ): string | undefined {
    const value = preFilledValues[fieldName];
    if (typeof value !== "string") {
      return undefined;
    }

    return value.split(",")[dataIndex];
  }

  private getPrefillArrayLength(
    preFilledValues: PromptValues,
    fieldName: string
  ): number {
    const value = preFilledValues[fieldName];
    if (typeof value !== "string") {
      return 0;
    }

    return value.split(",").length;
  }

  isPrefillFromArrayExists(
    dataIndex: number,
    promptOptions: CompiledPromptOptions,
    preFilledValues: PromptValues
  ): boolean {
    return this.getPrefillArrayValue(preFilledValues, promptOptions.name, dataIndex) !== undefined;
  }

  /**
   * Pre-fill prompts from array data on specific index
   * @param dataIndex
   * @param argument
   * @param promptOptions
   * @param preFilledValues
   */
  prefillFromArrayData(
    dataIndex: number,
    argument: ActionArgument,
    promptOptions: CompiledPromptOptions,
    preFilledValues: PromptValues
  ): void {
    const rawValue = this.getPrefillArrayValue(
      preFilledValues,
      promptOptions.name,
      dataIndex
    );

    if (rawValue === undefined) {
      return;
    }

    let preFilledValue: string | number = rawValue;

    if (argument.interactive?.options.type === "number") {
      const parsedValue = Number(rawValue);
      if (!Number.isNaN(parsedValue)) {
        preFilledValue = Number.isInteger(parsedValue)
          ? parsedValue
          : Number.parseFloat(rawValue);
      }
    }

    const override: PromptValues = {
      ...preFilledValues,
      [promptOptions.name]: preFilledValue,
    };

    prompts.override(override as Record<string, unknown>);
  }

  async ask(
    promptOptions: CompiledPromptOptions,
    extraOptions: prompts.Options,
    required?: boolean
  ): Promise<unknown> {
    let response = (await prompts(
      promptOptions,
      extraOptions
    )) as PromptValues;

    while (required && !response[promptOptions.name]) {
      if (!Object.prototype.hasOwnProperty.call(response, promptOptions.name)) {
        process.exit(1);
      }

      response = (await prompts(promptOptions, extraOptions)) as PromptValues;
    }

    return response[promptOptions.name];
  }

  /**
   * Interactively ask user for action to execute, and it's arguments.
   * Populate process.argv with user input.
   */
  async executeInteractive(): Promise<void> {
    // Ask for action
    const selectedAction = await this.askAction();
    if (!selectedAction) {
      process.exit(1);
      return;
    }

    const preFilledValues = this.prefillFromArguments(selectedAction, true);
    process.argv.push(selectedAction);

    const processedArguments: Record<string, boolean> = {};
    const actionArguments = this.getArgumentsForAction(selectedAction);
    const multi: Record<string, unknown[]> = {};

    for (const argument of actionArguments) {
      if (!argument.interactive) {
        continue;
      }

      const promptOptions = this.getPromptOptions(argument);
      if (processedArguments[promptOptions.name]) {
        continue;
      }
      processedArguments[promptOptions.name] = true;

      const message = promptOptions.message;
      const extraOptions: prompts.Options = {
        onSubmit: promptOptions.onSubmit,
      };
      let isRepeatable = Boolean(argument.interactive.repeat);

      if (!isRepeatable) {
        multi[promptOptions.name] = multi[promptOptions.name] || [];
        multi[promptOptions.name].push(
          await this.ask(
            promptOptions,
            extraOptions,
            Boolean(argument.interactive.options.required)
          )
        );
      }

      let repeatCount = 0;
      while (isRepeatable) {
        // Build pre-filled value for parent repeat
        if (typeof preFilledValues[promptOptions.name] === "string") {
          this.prefillFromArrayData(
            repeatCount,
            argument,
            promptOptions,
            preFilledValues
          );
        }

        promptOptions.message = `${message}`.replace(
          "{{index}}",
          ordinalSuffixOf(repeatCount + 1)
        );
        multi[promptOptions.name] = multi[promptOptions.name] || [];
        multi[promptOptions.name].push(await this.ask(promptOptions, extraOptions));

        // Processing "repeatWith".
        // For cases when some parameters are relative to each other and should be
        // asked from user in a relative way.
        let filledAsParent = false;
        for (const extraArgumentName of argument.interactive.repeatWith || []) {
          const extraArgument = this.findArgumentByName(
            extraArgumentName,
            actionArguments
          );

          if (!extraArgument) {
            continue;
          }

          // Build extra argument options
          const extraArgumentPromptOptions = this.getPromptOptions(extraArgument);
          const extraArgumentMessage = extraArgumentPromptOptions.message;
          const extraArgumentOptions: prompts.Options = {
            onSubmit: extraArgumentPromptOptions.onSubmit,
          };

          // Build pre-filled value for child repeat
          if (typeof preFilledValues[extraArgumentPromptOptions.name] === "string") {
            this.prefillFromArrayData(
              repeatCount,
              extraArgument,
              extraArgumentPromptOptions,
              preFilledValues
            );
          }

          extraArgumentPromptOptions.message = `${extraArgumentMessage}`.replace(
            "{{index}}",
            ordinalSuffixOf(repeatCount + 1)
          );

          // Prompt extra argument
          multi[extraArgumentPromptOptions.name] =
            multi[extraArgumentPromptOptions.name] || [];
          multi[extraArgumentPromptOptions.name].push(
            await this.ask(extraArgumentPromptOptions, extraArgumentOptions)
          );
          processedArguments[extraArgumentPromptOptions.name] = true;

          if (
            typeof preFilledValues[promptOptions.name] === "string" &&
            this.getPrefillArrayLength(preFilledValues, promptOptions.name) ===
              multi[extraArgumentPromptOptions.name].length
          ) {
            filledAsParent = true;
          }
        }

        if (filledAsParent) {
          isRepeatable = false;
        } else if (
          !this.isPrefillFromArrayExists(
            repeatCount + 1,
            promptOptions,
            preFilledValues
          )
        ) {
          const repeatResponse = (await prompts({
            type: "confirm",
            name: "value",
            message: argument.interactive.repeat,
            initial: true,
          })) as { value?: boolean };

          isRepeatable = Boolean(repeatResponse.value);
        }

        repeatCount++;
      }

      // if end of repeat logic, need to validate the list if validator exists
      if (argument.interactive.repeat && argument.interactive.validateList) {
        argument.interactive.validateList(multi[promptOptions.name]);
      }
    }

    for (const argumentName of Object.keys(multi)) {
      process.argv.push(
        `--${argumentName.replace(/(_)/gi, "-")}=${multi[argumentName].join(",")}`
      );
    }
  }

  /**
   * Find argument in list of arguments by its arg2 value.
   * @param extraArgumentName
   * @param actionArguments
   */
  findArgumentByName(
    extraArgumentName: string,
    actionArguments: ActionArgument[]
  ): ActionArgument | undefined {
    return actionArguments.find((argument) => extraArgumentName === argument.arg2);
  }

  /**
   * Returns list of arguments for selected user action
   * @param userAction
   */
  getArgumentsForAction(userAction: string): ActionArgument[] {
    for (const action of this.actions) {
      if (action.options.action === userAction) {
        return action.options.arguments;
      }
    }

    return [];
  }

  /**
   * Make an argument name useful for the flow
   * @param arg
   * @protected
   */
  protected sanitizeArgument(arg: string): string {
    return arg.replace(/^(--)/gi, "").replace(/(-)/gi, "_").trim();
  }

  /**
   * Compile final prompt options
   * @param argument
   */
  getPromptOptions(argument: ActionArgument): CompiledPromptOptions {
    const interactiveOptions = argument.interactive?.options || {};
    const message =
      (interactiveOptions.message as string | undefined) ||
      String(argument.options.help || "");
    const promptType =
      (typeof interactiveOptions.type === "string"
        ? interactiveOptions.type
        : "text") as CompiledPromptOptions["type"];

    return {
      ...interactiveOptions,
      type: promptType,
      name: this.sanitizeArgument(argument.arg2),
      message,
      onSubmit: argument.interactive?.onSubmit,
    };
  }

  async execute(): Promise<unknown> {
    // Interactive execution
    if (this.interactive) {
      await this.executeInteractive();
    }

    // Non-interactive execution
    // Add actions
    this.addActionsSubParsers();

    if (this.isRootHelpRequest()) {
      this.printRootHelp();
      return;
    }

    // Execute action
    const args = this.parse_args() as Namespace & {
      func?: (parsedArgs: Namespace) => unknown;
    };

    if (!args.func) {
      this.printRootHelp();
      return;
    }

    return args.func(args);
  }

  private isRootHelpRequest(): boolean {
    const userArgs = process.argv.slice(2);
    const asksForHelp = userArgs.includes("-h") || userArgs.includes("--help");
    if (!asksForHelp) {
      return false;
    }

    const actionNames = this.actions.map((action) => action.options.action);
    return !userArgs.some((arg) => actionNames.includes(arg));
  }

  private printRootHelp(): void {
    const scriptName = path.basename(process.argv[1] || "cli.js");
    const actionNames = this.actions
      .map((action) => action.options.action)
      .join(",");

    console.log(`usage: ${scriptName} [-h] <command> ...`);
    console.log("");
    console.log("optional arguments:");
    console.log("  -h, --help            show this help message and exit");
    console.log("");
    console.log("Actions:");
    console.log("  Possible actions");
    console.log("");

    const lines = this.actions.map((action) => {
      return {
        action: action.options.action,
        description: action.options.description || "",
      };
    });

    const maxActionLength = Math.max(
      ...lines.map((line) => line.action.length),
      7
    );
    for (const line of lines) {
      const paddedAction = line.action.padEnd(maxActionLength, " ");
      console.log(`  ${paddedAction}  ${line.description}`);
    }

    console.log("");
    console.log(`Use "${scriptName} <command> --help" for detailed options.`);
    console.log(`Available commands: ${actionNames}.`);
  }
}
