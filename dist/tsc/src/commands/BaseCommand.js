"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const tslib_1 = require("tslib");
const prompts_1 = tslib_1.__importDefault(require("prompts"));
const argparse_1 = require("argparse");
const ordinalSuffixOf = (i) => {
    const j = i % 10, k = i % 100;
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
class BaseCommand extends argparse_1.ArgumentParser {
    /**
     * @param interactive if the command should be interactive instead of classic CLI
     * @param options argparse options
     */
    constructor(interactive = false, options = undefined) {
        super(options);
        /**
         * List of all supported command actions.
         * @protected
         */
        this.actions = [];
        this.actionParsers = {};
        this.subParserOptions = {
            title: 'Actions',
            description: 'Possible actions',
            help: 'To get more detailed help: "<action> --help". ',
        };
        this.interactive = false;
        this.interactive = interactive;
    }
    /**
     * Add actions sub-parsers.
     */
    addActionsSubParsers() {
        this.subParsers = this.add_subparsers(this.subParserOptions);
        for (const action of this.actions) {
            const actionOptions = action.options;
            const actionParser = this.subParsers.add_parser(actionOptions.action);
            for (const argument of actionOptions.arguments) {
                actionParser.add_argument(argument.arg1, argument.arg2, argument.options);
            }
            actionParser.set_defaults({
                func: (args) => {
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
    async askAction() {
        // Skip asking action
        if (this.useAction) {
            return this.useAction;
        }
        const response = await (0, prompts_1.default)({
            type: 'select',
            name: 'action',
            message: `Select action`,
            choices: this.actions.map((action) => {
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
    prefillFromArguments(selectedAction, clearProcessArgs) {
        const actionArguments = this.getArgumentsForAction(selectedAction);
        const parser = new argparse_1.ArgumentParser();
        const [, args] = parser.parse_known_args();
        const parsedArgs = {};
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
        prompts_1.default.override(parsedArgs);
        if (clearProcessArgs) {
            process.argv = [process.argv[0], process.argv[1]];
        }
        return parsedArgs;
    }
    isPrefillFromArrayExists(dataIndex, promptOptions, preFilledValues) {
        var _a;
        return !!((_a = preFilledValues[promptOptions.name]) === null || _a === void 0 ? void 0 : _a.split(',')[dataIndex]);
    }
    /**
     * Pre-fill prompts from array data on specific index
     * @param dataIndex
     * @param argument
     * @param promptOptions
     * @param preFilledValues
     */
    prefillFromArrayData(dataIndex, argument, promptOptions, preFilledValues) {
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
        prompts_1.default.override(override);
    }
    async ask(promptOptions, extraOptions, required) {
        let response = {};
        response = await (0, prompts_1.default)(promptOptions, extraOptions);
        while (required && !response[promptOptions.name]) {
            if (Object.keys(response).indexOf(promptOptions.name) === -1) {
                process.exit(1);
            }
            response = await (0, prompts_1.default)(promptOptions, extraOptions);
        }
        return response[promptOptions.name];
    }
    /**
     * Interactively ask user for action to execute, and it's arguments.
     * Populate process.argv with user input.
     */
    async executeInteractive() {
        var _a, _b, _c, _d, _e;
        // Ask for action
        const selectedAction = await this.askAction();
        selectedAction || process.exit(1);
        const preFilledValues = this.prefillFromArguments(selectedAction, true);
        process.argv.push(selectedAction);
        const processedArguments = {};
        const actionArguments = this.getArgumentsForAction(selectedAction);
        const multi = {};
        for (const argument of actionArguments) {
            if (!argument.interactive)
                continue;
            const promptOptions = this.getPromptOptions(argument);
            if (processedArguments[promptOptions.name]) {
                continue;
            }
            processedArguments[promptOptions.name] = true;
            const message = promptOptions.message;
            const extraOptions = { onSubmit: promptOptions.onSubmit };
            let isRepeatable = !!((_a = argument.interactive) === null || _a === void 0 ? void 0 : _a.repeat);
            if (!isRepeatable) {
                multi[promptOptions.name] = multi[promptOptions.name] || [];
                multi[promptOptions.name].push(await this.ask(promptOptions, extraOptions));
            }
            let repeatCount = 0;
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
                }
                else if (!this.isPrefillFromArrayExists(repeatCount + 1, promptOptions, preFilledValues)) {
                    isRepeatable = (await (0, prompts_1.default)({ type: 'confirm', name: 'value', message: (_b = argument.interactive) === null || _b === void 0 ? void 0 : _b.repeat, initial: true })).value;
                }
                repeatCount++;
            }
            // if end of repeat logic, need to validate the list if validator exists
            if (((_c = argument.interactive) === null || _c === void 0 ? void 0 : _c.repeat) && ((_d = argument.interactive) === null || _d === void 0 ? void 0 : _d.validateList)) {
                (_e = argument.interactive) === null || _e === void 0 ? void 0 : _e.validateList(multi[promptOptions.name]);
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
    findArgumentByName(extraArgumentName, actionArguments) {
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
    getArgumentsForAction(userAction) {
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
    sanitizeArgument(arg) {
        return arg
            .replace(/^(--)/gi, '')
            .replace(/(-)/gi, '_')
            .trim();
    }
    /**
     * Compile final prompt options
     * @param argument
     */
    getPromptOptions(argument) {
        var _a, _b, _c, _d, _e;
        const message = ((_b = (_a = argument.interactive) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.message) || argument.options.help;
        return {
            ...((_c = argument.interactive) === null || _c === void 0 ? void 0 : _c.options) || {},
            type: ((_e = (_d = argument.interactive) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.type) || 'text',
            name: this.sanitizeArgument(argument.arg2),
            message,
            onSubmit: argument.interactive.onSubmit || undefined,
        };
    }
    async execute() {
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
exports.BaseCommand = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map