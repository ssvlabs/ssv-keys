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
            validate: (filePath: string) => boolean | string;
        };
    };
};
/**
 * Keystore argument validates if keystore file exists and is valid keystore file.
 */
export default _default;
