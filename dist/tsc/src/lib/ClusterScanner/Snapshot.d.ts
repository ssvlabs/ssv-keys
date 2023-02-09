export interface IClusterScannerParams {
    nodeUrl: string;
    contractAddress: string;
    ownerAddress: string;
    operatorIds: number[];
}
/**
 * Extract latest cluster (validator owner + operator ids) snapshot.
 */
export default class ClusterSnapshot {
    static get(params: IClusterScannerParams): Promise<string>;
}
