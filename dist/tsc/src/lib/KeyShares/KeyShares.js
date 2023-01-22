"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const KeySharesDataV2_1 = require("./KeySharesData/KeySharesDataV2");
const KeySharesPayloadV2_1 = require("./KeySharesData/KeySharesPayloadV2");
const KeySharesDataV3_1 = require("./KeySharesData/KeySharesDataV3");
const KeySharesPayloadV3_1 = require("./KeySharesData/KeySharesPayloadV3");
/**
 * Key shares file data interface.
 */
class KeyShares {
    /**
     * @param version
     */
    constructor({ version }) {
        // Versions of deeper structures
        this.byVersion = {
            'payload': {
                [KeyShares.VERSION_V2]: KeySharesPayloadV2_1.KeySharesPayloadV2,
                [KeyShares.VERSION_V3]: KeySharesPayloadV3_1.KeySharesPayloadV3,
            },
            'data': {
                [KeyShares.VERSION_V2]: KeySharesDataV2_1.KeySharesDataV2,
                [KeyShares.VERSION_V3]: KeySharesDataV3_1.KeySharesDataV3,
            }
        };
        this.version = version;
        this.data = this.getByVersion('data', version);
        this.payload = this.getByVersion('payload', version);
    }
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    generateContractPayload(data) {
        var _a;
        const payloadData = this.payload.build(data);
        (_a = this.payload) === null || _a === void 0 ? void 0 : _a.setData(payloadData);
    }
    /**
     * Set new data and validate it.
     * @param data
     */
    setData(data) {
        if (!data) {
            return;
        }
        this.data.setData(data);
        this.validate();
    }
    /**
     * Get entity by version.
     * @param entity
     * @param version
     * @private
     */
    getByVersion(entity, version) {
        if (!this.byVersion[entity]) {
            throw Error(`"${entity}" is unknown entity`);
        }
        if (!this.byVersion[entity][version]) {
            throw Error(`"${entity}" is not supported in version of key shares: ${version}`);
        }
        return new this.byVersion[entity][version]();
    }
    /**
     * Validate everything
     */
    validate() {
        var _a, _b;
        // Validate data and payload
        (_a = this.payload) === null || _a === void 0 ? void 0 : _a.validate();
        (_b = this.data) === null || _b === void 0 ? void 0 : _b.validate();
        (0, class_validator_1.validateOrReject)(this)
            .then()
            .catch((err) => {
            throw Error(err);
        });
    }
    /**
     * Initialise from JSON or object data.
     */
    fromJson(data) {
        // Parse json
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        this.setData(data.data);
        return this;
    }
    /**
     * Stringify key shares to be ready for saving in file.
     */
    toJson() {
        return JSON.stringify({
            version: this.version,
            data: this.data || null,
            payload: this.payload || null,
            createdAt: new Date().toISOString()
        }, null, '  ');
    }
}
KeyShares.VERSION_V2 = 'v2';
KeyShares.VERSION_V3 = 'v3';
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)()
], KeyShares.prototype, "version", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "payload", void 0);
exports.KeyShares = KeyShares;
//# sourceMappingURL=KeyShares.js.map