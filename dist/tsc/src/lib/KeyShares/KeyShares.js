"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const underscore_1 = tslib_1.__importDefault(require("underscore"));
const class_validator_1 = require("class-validator");
const KeySharesDataV2_1 = require("./KeySharesData/KeySharesDataV2");
const KeySharesPayloadV2_1 = require("./KeySharesData/KeySharesPayloadV2");
/**
 * Keyshares data interface.
 */
class KeyShares {
    /**
     * @param version
     */
    constructor({ version }) {
        this.version = version;
    }
    /**
     * Set final payload for web3 transaction and validate it.
     * @param payload
     */
    setPayload(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (payload) {
                this.payload = this.usePayload(payload, this.version);
                yield this.validatePayload();
            }
            return this;
        });
    }
    /**
     * Set new data and validate it.
     * @param data KeySharesData
     */
    setData(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (data) {
                this.data = this.useData(data, this.version);
                yield this.validateData();
            }
            return this;
        });
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
            const keyShares = new KeyShares({ version: data.version });
            yield keyShares.setData(data.data);
            yield keyShares.setPayload(data.payload);
            yield keyShares.validate();
            return keyShares;
        });
    }
    /**
     * Get final data converted from raw data.
     * @param payload
     * @param version
     */
    usePayload(payload, version) {
        if (underscore_1.default.isArray(payload)) {
            payload = {
                readable: {
                    validatorPublicKey: payload[KeyShares.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY],
                    operatorIds: payload[KeyShares.PAYLOAD_INDEX_OPERATOR_IDS],
                    sharePublicKeys: payload[KeyShares.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS],
                    sharePrivateKey: payload[KeyShares.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS],
                    ssvAmount: payload[KeyShares.PAYLOAD_INDEX_SSV_AMOUNT],
                },
                raw: payload.join(','),
            };
        }
        payload = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(this.payload || {}))), JSON.parse(JSON.stringify(payload || {})));
        switch (version) {
            case KeyShares.VERSION_V2:
                return new KeySharesPayloadV2_1.KeySharesPayloadV2(payload);
            default:
                throw Error(`Keyshares version is not supported: ${version}`);
        }
    }
    /**
     * Get final data converted from raw data.
     * @param data
     * @param version
     */
    useData(data, version) {
        data = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(this.data || {}))), JSON.parse(JSON.stringify(data || {})));
        if (underscore_1.default.isArray(data.shares)) {
            data.shares = {
                publicKeys: data.shares.map((share) => share.publicKey),
                encryptedKeys: data.shares.map((share) => share.privateKey),
            };
        }
        switch (version) {
            case KeyShares.VERSION_V2:
                return new KeySharesDataV2_1.KeySharesDataV2(data);
            default:
                throw Error(`Keyshares version is not supported: ${version}`);
        }
    }
    /**
     * Validate everything
     */
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Validate classes and structures
            yield (0, class_validator_1.validateOrReject)(this).catch(errors => {
                throw Error(`Keyshares file have wrong format. Errors: ${JSON.stringify(errors, null, '  ')}`);
            });
            // Validate data and payload
            yield this.validateData();
            yield this.validatePayload();
        });
    }
    /**
     * Validate payload
     */
    validatePayload() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_a = this.payload) === null || _a === void 0 ? void 0 : _a.validate());
            }
            catch (errors) {
                throw Error(`Keyshares payload did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
            }
        });
    }
    /**
     * Validate data
     */
    validateData() {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_a = this.data) === null || _a === void 0 ? void 0 : _a.validate());
            }
            catch (errors) {
                throw Error(`Keyshares data did not pass validation. Errors: ${errors.message || errors.stack || errors.trace || String(errors)}`);
            }
        });
    }
    /**
     * Stringify keyshare to be ready for saving in file.
     */
    toString() {
        return JSON.stringify({
            version: this.version,
            data: this.data || null,
            payload: this.payload || null,
            createdAt: new Date().toISOString()
        }, null, '  ');
    }
}
KeyShares.VERSION_V2 = 'v2';
KeyShares.PAYLOAD_INDEX_VALIDATOR_PUBLIC_KEY = 0;
KeyShares.PAYLOAD_INDEX_OPERATOR_IDS = 1;
KeyShares.PAYLOAD_INDEX_SHARE_PUBLIC_KEYS = 2;
KeyShares.PAYLOAD_INDEX_SHARE_PRIVATE_KEYS = 3;
KeyShares.PAYLOAD_INDEX_SSV_AMOUNT = 4;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsNotEmpty)()
], KeyShares.prototype, "version", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "data", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)()
], KeyShares.prototype, "payload", void 0);
exports.KeyShares = KeyShares;
//# sourceMappingURL=KeyShares.js.map