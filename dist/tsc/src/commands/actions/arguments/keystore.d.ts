/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
declare const _default: {
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
            message: string;
            validate: (filePath: string) => string | boolean | undefined;
        };
    };
};
export default _default;
