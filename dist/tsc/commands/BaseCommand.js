"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const tslib_1 = require("tslib");
const argparse_1 = require("argparse");
class BaseCommand extends argparse_1.ArgumentParser {
    constructor() {
        super(...arguments);
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
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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