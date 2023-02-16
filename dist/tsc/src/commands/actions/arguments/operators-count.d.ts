declare const _default: {
    arg1: string;
    arg2: string;
    options: {
        type: NumberConstructor;
        required: boolean;
        default: number;
        help: string;
    };
    interactive: {
        options: {
            type: string;
            message: string;
            validate: (value: number) => true | "Invalid operators amount.";
        };
    };
};
export default _default;
