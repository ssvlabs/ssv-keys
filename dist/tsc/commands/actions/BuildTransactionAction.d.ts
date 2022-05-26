import { BaseAction } from './BaseAction';
export declare class BuildTransactionAction extends BaseAction {
    static get options(): any;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
}
