declare const _default: {
    arg1: string;
    arg2: string;
    options: {
        type: StringConstructor;
        required: boolean;
        help: string;
    };
    interactive: {
        repeat: string;
        repeatWith: string[];
        options: {
            type: string;
            message: string;
            validate: (operatorId: number) => boolean | string;
        };
        validateList: (items: []) => void;
    };
};
export default _default;
