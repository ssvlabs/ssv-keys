import { BaseAction } from './BaseAction';
/**
 * Command to build keyshares from user input.
 */
export declare class KeySharesAction extends BaseAction {
    static get options(): any;
    execute(): Promise<string>;
    private getKeySharesList;
    private validateKeystoreArguments;
    private isDirectory;
    private processKeystorePath;
    private processKeystore;
    private validateKeystoreFiles;
    private validateSingleKeystore;
    private getOperators;
    private processFile;
    private saveKeyShares;
}
