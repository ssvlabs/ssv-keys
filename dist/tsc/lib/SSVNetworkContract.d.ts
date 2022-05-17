import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
export declare class SSVNetworkContract {
    static BLOCKS_PER_YEAR: number;
    protected contractAddress: string;
    protected nodeUrl: string;
    protected contracts: any;
    protected web3Instances: any;
    getWeb3(nodeUrl?: string): Web3;
    getLiquidationCollateral(): Promise<number>;
    getNetworkFee(): Promise<number>;
    getContract(): Contract;
    setContractAddress(address: string): void;
    setNodeUrl(nodeUrl: string): void;
}
