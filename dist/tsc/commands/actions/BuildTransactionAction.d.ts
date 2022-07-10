import { BuildSharesAction } from './BuildSharesAction';
export declare class BuildTransactionAction extends BuildSharesAction {
    static SSV_AMOUNT_ARGUMENT: {
        arg1: string;
        arg2: string;
        options: {
            type: StringConstructor;
            required: boolean;
            help: string;
        };
        interactive: {
            options: {
                type: string;
                validate: (tokenAmount: string) => true | "Token amount should be positive big number in Wei";
            };
        };
    };
    static get options(): any;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
}
