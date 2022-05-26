"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAction = void 0;
const tslib_1 = require("tslib");
const SSVKeys_1 = require("../../lib/SSVKeys");
class BaseAction {
    constructor() {
        this.ssvKeys = new SSVKeys_1.SSVKeys();
        this.args = {};
    }
    setArgs(args) {
        this.args = args;
        return this;
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw Error('Should implement "execute"');
        });
    }
    static get options() {
        throw Error('Should implement static "options"');
    }
    get options() {
        return BaseAction.options;
    }
}
exports.BaseAction = BaseAction;
//# sourceMappingURL=BaseAction.js.map