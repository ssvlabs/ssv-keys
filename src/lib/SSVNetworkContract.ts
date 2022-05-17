import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

export class SSVNetworkContract {
  static BLOCKS_PER_YEAR = 2398050;
  protected contractAddress = '';
  protected nodeUrl = '';
  protected contracts: any = {};
  protected web3Instances: any = {};

  getWeb3(nodeUrl = process.env.NODE_URL || ''): Web3 {
    if (!this.web3Instances[nodeUrl]) {
      this.web3Instances[nodeUrl] = new Web3(String(nodeUrl || ''))
    }
    return this.web3Instances[nodeUrl];
  }

  async getLiquidationCollateral(): Promise<number> {
    return this.getContract().methods.minimumBlocksBeforeLiquidation().call();
  }

  async getNetworkFee(): Promise<number> {
    return this.getContract().methods.networkFee().call();
  }

  getContract(): Contract {
    if (!this.contracts[this.contractAddress]) {
      this.contracts[this.contractAddress] = this.getWeb3(this.nodeUrl);
    }
    return this.contracts[this.contractAddress];
  }

  setContractAddress(address: string) {
    this.contractAddress = address;
  }

  setNodeUrl(nodeUrl: string) {
    this.nodeUrl = nodeUrl;
  }
}
