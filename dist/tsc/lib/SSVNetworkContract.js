"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SSVNetworkContract = void 0;
const tslib_1 = require("tslib");
const web3_1 = tslib_1.__importDefault(require("web3"));
class SSVNetworkContract {
    constructor() {
        this.contractAddress = '';
        this.nodeUrl = '';
        this.contracts = {};
        this.web3Instances = {};
    }
    getWeb3(nodeUrl = process.env.NODE_URL || '') {
        if (!this.web3Instances[nodeUrl]) {
            this.web3Instances[nodeUrl] = new web3_1.default(String(nodeUrl || ''));
        }
        return this.web3Instances[nodeUrl];
    }
    getLiquidationCollateral() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getContract().methods.minimumBlocksBeforeLiquidation().call();
        });
    }
    getNetworkFee() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getContract().methods.networkFee().call();
        });
    }
    getContract() {
        if (!this.contracts[this.contractAddress]) {
            this.contracts[this.contractAddress] = this.getWeb3(this.nodeUrl);
        }
        return this.contracts[this.contractAddress];
    }
    setContractAddress(address) {
        this.contractAddress = address;
    }
    setNodeUrl(nodeUrl) {
        this.nodeUrl = nodeUrl;
    }
}
exports.SSVNetworkContract = SSVNetworkContract;
SSVNetworkContract.BLOCKS_PER_YEAR = 2398050;
//# sourceMappingURL=SSVNetworkContract.js.map