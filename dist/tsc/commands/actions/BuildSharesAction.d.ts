import { BaseAction } from './BaseAction';
import { ISharesKeyPairs } from '../../lib/Threshold';
import { EncryptShare } from '../../lib/Encryption/Encryption';
export declare type IDispatchResult = {
    privateKey: string;
    keystore: string;
    password: string;
    operatorsIds: number[];
    operators: string[];
    shares: EncryptShare[];
    threshold: ISharesKeyPairs;
};
export declare class BuildSharesAction extends BaseAction {
    static KEYSTORE_ARGUMENT: {
        arg1: string;
        arg2: string;
        options: {
            required: boolean;
            type: StringConstructor;
            help: string;
        };
        interactive: {
            options: {
                type: string;
                validate: (filePath: string) => boolean | string;
            };
        };
    };
    static PASSWORD_ARGUMENT: {
        arg1: string;
        arg2: string;
        options: {
            required: boolean;
            type: StringConstructor;
            help: string;
        };
        interactive: {
            options: {
                type: string;
                validate: (password: string) => Promise<string | boolean>;
            };
        };
    };
    static OPERATORS_PUBLIC_KEYS_ARGUMENT: {
        arg1: string;
        arg2: string;
        options: {
            type: StringConstructor;
            required: boolean;
            help: string;
        };
        interactive: {
            repeat: number;
            repeatWith: string[];
            options: {
                type: string;
                message: string;
                validate: (operator: string) => Promise<string | boolean>;
            };
        };
    };
    static OPERATORS_IDS_ARGUMENT: {
        arg1: string;
        arg2: string;
        options: {
            type: StringConstructor;
            required: boolean;
            help: string;
        };
        interactive: {
            repeat: number;
            options: {
                type: string;
                message: string;
                validate: (operatorId: number) => true | "Operator ID should be positive integer number";
            };
        };
    };
    static OUTPUT_FORMAT_ARGUMENT: {
        arg1: string;
        arg2: string;
        options: {
            type: StringConstructor;
            required: boolean;
            default: string;
            help: string;
        };
        interactive: {
            options: {
                type: string;
                message: string;
                choices: {
                    title: string;
                    description: string;
                    value: string;
                }[];
                initial: number;
            };
        };
    };
    static get options(): any;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
    dispatch(): Promise<IDispatchResult>;
}
