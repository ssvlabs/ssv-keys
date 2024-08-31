"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyShares = void 0;
const tslib_1 = require("tslib");
const semver_1 = tslib_1.__importDefault(require("semver"));
const package_json_1 = tslib_1.__importDefault(require("../../../package.json"));
const class_validator_1 = require("class-validator");
const KeySharesItem_1 = require("./KeySharesItem");
const base_1 = require("../exceptions/base");
/**
 * Represents a collection of KeyShares items with functionality for serialization,
 * deserialization, and validation.
 */
class KeyShares {
    constructor(shares = []) {
        this.shares = [...shares];
    }
    /**
     * Add a single KeyShares item to the collection.
     * @param keySharesItem The KeyShares item to add.
     */
    add(keySharesItem) {
        this.shares.push(keySharesItem);
    }
    list() {
        return this.shares;
    }
    /**
     * Validate the KeyShares instance using class-validator.
     * @returns The validation result.
     */
    validate() {
        (0, class_validator_1.validateSync)(this);
    }
    /**
     * Converts the KeyShares instance to a JSON string.
     * @returns The JSON string representation of the KeyShares instance.
     */
    toJson() {
        return JSON.stringify({
            version: `v${package_json_1.default.version}`,
            createdAt: new Date().toISOString(),
            shares: this.shares.length > 0 ? this.shares : null,
        }, null, 2);
    }
    /**
     * Initialize the KeyShares instance from JSON or object data.
     * @param content The JSON string or object to initialize from.
     * @returns The KeyShares instance.
     * @throws Error if the version is incompatible or the shares array is invalid.
     */
    static async fromJson(content) {
        const body = typeof content === 'string' ? JSON.parse(content) : content;
        const extVersion = semver_1.default.parse(body.version);
        const currentVersion = semver_1.default.parse(package_json_1.default.version);
        const tmpPrevVersion = semver_1.default.parse('v1.1.0');
        if (!extVersion || !currentVersion || !tmpPrevVersion) {
            throw new base_1.SSVKeysException(`The file for keyshares must contain a version mark provided by ssv-keys.`);
        }
        if (!extVersion || (currentVersion.major !== extVersion.major) || (currentVersion.minor !== extVersion.minor && tmpPrevVersion.minor !== extVersion.minor)) {
            throw new base_1.SSVKeysException(`The keyshares file you are attempting to reuse does not have the same version (v${package_json_1.default.version}) as supported by ssv-keys`);
        }
        const instance = new KeyShares();
        instance.shares = [];
        if (Array.isArray(body.shares)) {
            // Process each item in the array
            for (const item of body.shares) {
                instance.shares.push(await KeySharesItem_1.KeySharesItem.fromJson(item));
            }
        }
        else {
            // Handle old format (single item)
            instance.shares.push(await KeySharesItem_1.KeySharesItem.fromJson(body));
        }
        return instance;
    }
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true })
], KeyShares.prototype, "shares", void 0);
exports.KeyShares = KeyShares;
//# sourceMappingURL=KeyShares.js.map