"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAction = void 0;
const base_1 = require("../../lib/exceptions/base");
class BaseAction {
    constructor() {
        this.args = {};
    }
    setArgs(args) {
        this.args = args;
        return this;
    }
    async execute() {
        throw new base_1.SSVKeysException('Should implement "execute"');
    }
    static get options() {
        throw new base_1.SSVKeysException('Should implement static "options"');
    }
    get options() {
        return BaseAction.options;
    }
    /**
     * Pre-execution method which can be run before execution logic.
     */
    preExecute() {
        return;
    }
    /**
     * Pre-options reading method which can be run before the logic where options read happened.
     * Should also return options which can be changed.
     * @param options
     */
    async preOptions(options) {
        return options;
    }
}
exports.BaseAction = BaseAction;
//# sourceMappingURL=BaseAction.js.map