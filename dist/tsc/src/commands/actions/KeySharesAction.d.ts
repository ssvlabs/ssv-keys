import { BaseAction } from './BaseAction';
/**
 * Command to build keyshares from user input.
 */
export declare class KeySharesAction extends BaseAction {
    static get options(): any;
    execute(): Promise<string>;
    private validateKeystoreArguments;
    private processKeystorePath;
    private validateKeystoreFiles;
    private getOperators;
    private processFile;
    private saveKeyShares;
}
