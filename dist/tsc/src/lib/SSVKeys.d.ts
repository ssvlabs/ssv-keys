import { KeyShares } from './KeyShares/KeyShares';
import { IShares, ISharesKeyPairs } from './Threshold';
import { EncryptShare } from './Encryption/Encryption';
export interface IPayloadMetaData {
    publicKey: string;
    operatorIds: number[];
    encryptedShares: EncryptShare[];
}
/**
 * SSVKeys class provides high-level methods to easily work with entire flow:
 *  - getting private key from keystore file using password
 *  - creating shares threshold
 *  - creating final shares
 *  - building final payload which is ready to be used in web3 transaction
 */
export declare class SSVKeys {
    static SHARES_FORMAT_ABI: string;
    static VERSION: {
        V3: string;
    };
    protected version: string;
    protected threshold: ISharesKeyPairs | undefined;
    keySharesInstance: KeyShares;
    privateKey: any;
    publicKey: any;
    constructor();
    get keyShares(): KeyShares;
    /**
     * Extract private key from keystore data using keystore password.
     * Generally can be used in browsers when the keystore data has been provided by browser.
     * @param data
     * @param password
     */
    getPrivateKeyFromKeystoreData(data: string, password: string): Promise<string>;
    /**
     * Build threshold using private key for number of participants and failed participants.
     * @param privateKey
     * @param operators
     */
    createThreshold(privateKey: string, operatorIds: number[]): Promise<ISharesKeyPairs>;
    /**
     * Encrypt operators shares using operators public keys.
     * @param operatorsPublicKeys
     * @param shares
     * @param sharesFormat
     */
    encryptShares(operatorsPublicKeys: string[], shares: IShares[]): Promise<EncryptShare[]>;
    /**
     * Build shares from private key, operator IDs and public keys
     * @param privateKey
     * @param operatorIds
     * @param operatorPublicKeys
     */
    buildShares(privateKey: string, operatorIds: number[], operatorPublicKeys: string[]): Promise<EncryptShare[]>;
    /**
     * Getting threshold if it has been created before.
     */
    getThreshold(): ISharesKeyPairs | undefined;
    /**
     * Build payload from encrypted shares, validator public key and operator IDs
     * @param publicKey
     * @param operatorIds
     * @param encryptedShares
     */
    buildPayload(metaData: IPayloadMetaData): Promise<any>;
}
