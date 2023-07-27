export declare class KeystorePasswordValidator {
    protected keystoreFilePath: string;
    validatePassword(password: string, keystoreFilePath: string): Promise<boolean | string>;
}
export declare const keystorePasswordValidator: KeystorePasswordValidator;
