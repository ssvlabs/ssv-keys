import { ArgumentParser, SubParser } from 'argparse';
export declare class BaseCommand extends ArgumentParser {
    /**
     * List of all supported command actions.
     * @protected
     */
    protected actions: any;
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
    /**
     * Add actions sub-parsers.
     */
    addActionsSubParsers(): ArgumentParser;
    execute(): Promise<void>;
}
