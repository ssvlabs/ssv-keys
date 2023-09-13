declare const _default: {
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
            message: string;
            validate: (value: string) => any;
        };
    };
};
export default _default;
