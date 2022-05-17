import { ArgumentOptions, Namespace } from 'argparse';
export interface ActionArgument {
    arg1: string;
    arg2: string;
    options: ArgumentOptions;
}
export interface ActionOptions {
    action: string;
    shortAction: string;
    arguments: ActionArgument[];
}
export declare class BaseAction {
    ssvKeys: any;
    protected args: Namespace;
    setArgs(args: Namespace): BaseAction;
    execute(): Promise<any>;
    static get options(): ActionOptions;
}
