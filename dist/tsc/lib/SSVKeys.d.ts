import Web3 from 'web3';
import { IShares, ISharesKeyPairs } from './Threshold';
import { EncryptShare } from './Encryption/Encryption';
export declare class SSVKeys {
    static OPERATOR_FORMAT_BASE64: string;
    protected web3Instances: any;
    getWeb3(nodeUrl?: string): Web3;
    /**
     * Extract private key from keystore data using keystore password.
     * Generally can be used in browsers when the keystore data has been provided by browser.
     * @param data
     * @param password
     */
    getPrivateKeyFromKeystoreData(data: string, password: string): Promise<string>;
    /**
     * Build threshold using private key for number of participants and failed participants.
     * TODO: make it possible to choose how many fails can be in threshold
     * @param privateKey
     */
    createThreshold(privateKey: string): Promise<ISharesKeyPairs>;
    /**
     * Encrypt operators shares using operators public keys.
     * @param operatorsPublicKeys
     * @param shares
     * @param operatorFormat
     */
    encryptShares(operatorsPublicKeys: string[], shares: IShares[], operatorFormat?: string): Promise<EncryptShare[]>;
    /**
     * Encode with Web3 eth abi method any fields of shares array required for transaction.
     * @param encryptedShares
     * @param field
     */
    abiEncode(encryptedShares: EncryptShare[], field: string): string[];
    /**
     * Having keystore private key build final transaction payload for list of operators IDs from contract.
     *
     * Example:
     *
     *    const privateKey = await ssvKeys.getPrivateKeyFromKeystoreFile(keystoreFilePath, keystorePassword);
     *    const encryptedShares = await ssvKeys.encryptShares(operatorsPublicKeys, shares);
     *    await ssvKeys.buildPayloadV2(...)
     *
     * @param privateKey
     * @param operatorsIds
     * @param encryptedShares
     * @param tokenAmount
     */
    buildPayload(privateKey: string, operatorsIds: number[], encryptedShares: EncryptShare[], tokenAmount: number): Promise<any[]>;
}
