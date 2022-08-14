"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const KeySharesDataV2_1 = require("./KeySharesData/KeySharesDataV2");
/**
 * Keyshares data interface.
 */
class KeyShares {
    /**
     * Receives as parameter already read and json parsed structure.
     * @param version
     * @param data
     * @param payload
     */
    constructor({ version, data, payload }) {
        this.version = version;
        this.data = data;
        this.payload = payload || '';
    }
    /**
     * Set final payload for web3 transaction.
     * @param payload
     */
    setPayload(payload) {
        this.payload = payload;
        return this;
    }
    /**
     * Instantiate keyshare from raw data as string or object.
     * @param data
     */
    static fromData(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Parse json
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            // Create keyshares data instance depending on version
            let keySharesDataInstance;
            switch (data.version) {
                case KeyShares.VERSION_V2:
                    keySharesDataInstance = new KeySharesDataV2_1.KeySharesDataV2(data.data);
                    break;
                default:
                    throw Error(`Keyshares version is not supported: ${data.version}`);
            }
            // Create keyshares instance
            const keyShares = new KeyShares({
                version: data.version,
                data: keySharesDataInstance,
                payload: data.payload || '',
            });
            // Validate classes and structures
            yield (0, class_validator_1.validateOrReject)(keyShares).catch(errors => {
                throw Error(`Keyshares file have wrong format. Errors: ${JSON.stringify(errors, null, '  ')}`);
            });
            // Deeper validation of data itself
            try {
                yield keyShares.data.validate();
            }
            catch (errors) {
                throw Error(`Keyshares data did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
            }
            return keyShares;
        });
    }
    /**
     * Stringify keyshare to be ready for saving in file.
     */
    toString() {
        return JSON.stringify({
            version: this.version,
            data: this.data,
            payload: this.payload || '',
            createdAt: new Date().toISOString()
        }, null, '  ');
    }
}
KeyShares.VERSION_V2 = 'v2';
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)()
], KeyShares.prototype, "version", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)()
], KeyShares.prototype, "payload", void 0);
exports.KeyShares = KeyShares;
//# sourceMappingURL=KeyShares.js.map