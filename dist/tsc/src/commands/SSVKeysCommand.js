"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVKeysCommand = void 0;
const BaseCommand_1 = require("./BaseCommand");
const KeySharesAction_1 = require("./actions/KeySharesAction");
const KeySharesCustomBulkAction_1 = require("./actions/KeySharesCustomBulkAction");
class SSVKeysCommand extends BaseCommand_1.BaseCommand {
    /**
     * Add more specific help.
     */
    constructor(interactive = false, defaultAction, options = undefined) {
        super(interactive, options);
        /**
         * List of all supported command actions.
         * @protected
         */
        this.actions = [
            KeySharesAction_1.KeySharesAction,
            KeySharesCustomBulkAction_1.KeySharesCustomBulkAction,
        ];
        this.useAction = 'shares';
        if (defaultAction)
            this.useAction = defaultAction;
        this.subParserOptions.help += 'Example: "yarn cli shares --help"';
    }
}
exports.SSVKeysCommand = SSVKeysCommand;
//# sourceMappingURL=SSVKeysCommand.js.map