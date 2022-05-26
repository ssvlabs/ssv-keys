import { ArgumentParser, SubParser } from 'argparse';
export declare class BaseCommand extends ArgumentParser {
    /**
     * List of all supported command actions.
     * @protected
     */
    protected actions: any[];
    protected actionParsers: any;
    protected subParserOptions: {
        title: string;
        description: string;
        help: string;
    };
    /**
     * Argparse sub parser to hold all the command actions options.
     * @protected
     */
    protected subParsers: SubParser | undefined;
    protected interactive: boolean;
    /**
     * @param interactive if the command should be interactive instead of classic CLI
     * @param options argparse options
     */
    constructor(interactive?: boolean, options?: undefined);
    /**
     * Add actions sub-parsers.
     */
    addActionsSubParsers(): ArgumentParser;
    /**
     * Interactively ask user for action
     */
    askAction(): Promise<string>;
    /**
     * Interactively ask user for action to execute, and it's arguments.
     * Populate process.argv with user input.
     */
    executeInteractive(): Promise<any>;
    execute(): Promise<void>;
}
