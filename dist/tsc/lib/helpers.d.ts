/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param json
 */
export declare const readFile: (filePath: string, json?: boolean) => Promise<any>;
/**
 * Read file contents and return json data from it.
 * @param filePath
 * @param data
 */
export declare const writeFile: (filePath: string, data: string) => Promise<any>;
