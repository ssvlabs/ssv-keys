import { BaseAction } from './BaseAction';
import { ISharesKeyPairs } from '../../lib/Threshold';
import { EncryptShare } from '../../lib/Encryption/Encryption';
export declare type EncryptedSharesResult = {
    privateKey: string;
    keystore: string;
    password: string;
    payload: any[];
    operatorIds: number[];
    operatorPublicKeys: string[];
    shares: EncryptShare[];
    threshold: ISharesKeyPairs;
};
/**
 * Command to build keyshares from user input.
 */
export declare class KeySharesAction extends BaseAction {
    static get options(): any;
    /**
     * Decrypt and return private key.
     */
    execute(): Promise<any>;
    /**
     * Encrypt shares and return all information that can be useful.
     * @param keystore
     * @param password
     * @param operatorIds
     * @param operatorPublicKeys
     * @param ssvAmount
     */
    encryptShares(keystore: string, password: string, operatorIds: number[], operatorPublicKeys: string[], ssvAmount: number): Promise<EncryptedSharesResult>;
}
