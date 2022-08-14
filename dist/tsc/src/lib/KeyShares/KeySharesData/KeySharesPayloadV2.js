"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySharesPayloadV2 = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
// ---------------------------------------------------------------
// Structure classes
// ---------------------------------------------------------------
class KeySharesPayloadV2 {
    constructor(data) {
        this.explained = {};
        this.raw = '';
        this.explained = data.explained || {};
        this.raw = data.raw || '';
    }
    /**
     * Do all possible validations.
     */
    validate() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // Find out how final payload can be validated.
        });
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsObject)()
], KeySharesPayloadV2.prototype, "explained", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)()
], KeySharesPayloadV2.prototype, "raw", void 0);
exports.KeySharesPayloadV2 = KeySharesPayloadV2;
//# sourceMappingURL=KeySharesPayloadV2.js.map