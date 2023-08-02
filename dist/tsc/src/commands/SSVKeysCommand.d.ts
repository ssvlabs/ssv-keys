import { BaseCommand } from './BaseCommand';
import { KeySharesAction } from './actions/KeySharesAction';
import { KeySharesCustomBulkAction } from './actions/KeySharesCustomBulkAction';
export declare class SSVKeysCommand extends BaseCommand {
    /**
     * List of all supported command actions.
     * @protected
     */
    protected actions: (typeof KeySharesAction | typeof KeySharesCustomBulkAction)[];
    protected useAction: string;
    /**
     * Add more specific help.
     */
    constructor(interactive?: boolean, defaultAction?: string, options?: undefined);
}
