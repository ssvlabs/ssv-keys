import { BaseCommand } from './BaseCommand';
import { PrivateKeyAction } from './actions/PrivateKeyAction';
export declare class SSVKeysCommand extends BaseCommand {
    /**
     * List of all supported command actions.
     * @protected
     */
    protected actions: (typeof PrivateKeyAction)[];
    /**
     * Add more specific help.
     */
    constructor();
}
