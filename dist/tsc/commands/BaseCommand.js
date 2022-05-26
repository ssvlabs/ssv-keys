"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const tslib_1 = require("tslib");
const prompts_1 = tslib_1.__importDefault(require("prompts"));
const argparse_1 = require("argparse");
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
            const actionParser = this.subParsers.add_parser(actionOptions.action, {
                aliases: [actionOptions.shortAction]
            });
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
    askAction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const response = yield (0, prompts_1.default)({
                type: 'select',
                name: 'action',
                message: `Select action`,
                choices: this.actions.map((action) => {
                    return { title: action.options.action, value: action.options.action };
                }),
            });
            return response.action;
        });
    }
    /**
     * Interactively ask user for action to execute, and it's arguments.
     * Populate process.argv with user input.
     */
    executeInteractive() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Ask for action
            const selectedAction = yield this.askAction();
            selectedAction || process.exit(1);
            process.argv.push(selectedAction);
            // Ask for all action arguments
            for (const action of this.actions) {
                if (action.options.action === selectedAction) {
                    const actionOptions = action.options;
                    for (const argument of actionOptions.arguments) {
                        const message = ((_b = (_a = argument.interactive) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.message) || argument.options.help;
                        const promptOptions = Object.assign(Object.assign({}, ((_c = argument.interactive) === null || _c === void 0 ? void 0 : _c.options) || {}), { type: ((_e = (_d = argument.interactive) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.type) || 'text', name: ((_g = (_f = argument.interactive) === null || _f === void 0 ? void 0 : _f.options) === null || _g === void 0 ? void 0 : _g.name) || argument.arg2, message });
                        if (((_h = argument.interactive) === null || _h === void 0 ? void 0 : _h.repeat) || 0 > 1) {
                            const multi = [];
                            const repeats = argument.interactive.repeat;
                            for (let i = 1; i <= repeats; i++) {
                                promptOptions.message = `${message}: ${i} from ${repeats}`;
                                const response = yield (0, prompts_1.default)(promptOptions);
                                if (argument.options.required && !response[promptOptions.name]) {
                                    process.exit(1);
                                }
                                multi.push(response[promptOptions.name]);
                            }
                            process.argv.push(`${argument.arg2}=${multi.join(',')}`);
                        }
                        else {
                            const response = yield (0, prompts_1.default)(promptOptions);
                            if (argument.options.required && !response[promptOptions.name]) {
                                process.exit(1);
                            }
                            process.argv.push(`${argument.arg2}=${response[promptOptions.name]}`);
                        }
                    }
                }
            }
        });
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Interactive execution
            if (this.interactive) {
                yield this.executeInteractive();
            }
            // Non-interactive execution
            // Add actions
            this.addActionsSubParsers();
            // Execute action
            const args = this.parse_args();
            return args.func(args);
        });
    }
}
exports.BaseCommand = BaseCommand;
//# sourceMappingURL=BaseCommand.js.map