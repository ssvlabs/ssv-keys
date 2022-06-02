import { BaseCommand } from './BaseCommand';
import { BuildSharesAction } from './actions/BuildSharesAction';
export declare class SSVKeysCommand extends BaseCommand {
    /**
     * List of all supported command actions.
     * @protected
     */
    protected actions: (typeof BuildSharesAction)[];
    /**
     * Add more specific help.
     */
    constructor(interactive?: boolean, options?: undefined);
}
