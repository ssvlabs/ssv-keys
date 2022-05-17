import { SSVKeysV2 } from '../../lib/SSVKeysV2';
import { ActionOptions, BaseAction } from './BaseAction';
export declare class BuildTransactionV2Action extends BaseAction {
    ssvKeys: SSVKeysV2;
    static get options(): ActionOptions;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
}
