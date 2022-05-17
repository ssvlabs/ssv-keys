import { ActionOptions, BaseAction } from './BaseAction';
export declare class BuildTransactionAction extends BaseAction {
    static get options(): ActionOptions;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
}
