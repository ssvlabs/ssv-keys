"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cluster_scanner_1 = require("cluster-scanner");
/**
 * Extract latest cluster (validator owner + operator ids) snapshot.
 */
class ClusterSnapshot {
    static get(params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const command = new cluster_scanner_1.SSVScannerCommand(params);
            const result = yield command.scan();
            return result.payload['Data'];
        });
    }
}
exports.default = ClusterSnapshot;
//# sourceMappingURL=Snapshot.js.map