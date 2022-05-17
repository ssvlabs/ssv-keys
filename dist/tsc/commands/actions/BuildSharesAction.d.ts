import { ActionOptions, BaseAction } from './BaseAction';
export declare class BuildSharesAction extends BaseAction {
    static get options(): ActionOptions;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
}
