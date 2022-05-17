import { SSVKeys } from './SSVKeys';
import { EncryptShare } from './Encryption/Encryption';
export declare class SSVKeysV2 extends SSVKeys {
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
     * @param tokenAmountGwei
     */
    buildPayloadV2(privateKey: string, operatorsIds: number[], encryptedShares: EncryptShare[], tokenAmountGwei: number): Promise<any[]>;
}
