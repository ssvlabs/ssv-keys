"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorPublicKeyValidator = void 0;
const tslib_1 = require("tslib");
const js_base64_1 = require("js-base64");
const JSEncrypt_1 = tslib_1.__importDefault(require("../../../lib/JSEncrypt"));
const operator_1 = require("../../../lib/exceptions/operator");
const operatorPublicKeyValidator = (publicKey) => {
    publicKey = publicKey.trim();
    const begin = '-----BEGIN RSA PUBLIC KEY-----';
    const end = '-----END RSA PUBLIC KEY-----';
    const encrypt = new JSEncrypt_1.default({});
    let decodedOperator = '';
    try {
        let decodedPublicKey = '';
        if (!publicKey.startsWith(begin)) {
            if (publicKey.length < 98) {
                throw new Error('The length of the operator public key must be at least 98 characters.');
            }
            try {
                decodedPublicKey = (0, js_base64_1.decode)(publicKey).trim();
            }
            catch (error) {
                throw new Error("Failed to decode the operator public key. Ensure it's correctly base64 encoded.");
            }
            if (!decodedPublicKey.startsWith(begin)) {
                throw new Error(`Operator public key does not start with '${begin}'`);
            }
        }
        else {
            decodedPublicKey = publicKey;
        }
        if (!decodedPublicKey.endsWith(end)) {
            throw new Error(`Operator public key does not end with '${end}'`);
        }
        try {
            // Get the content without the header and footer
            const content = decodedPublicKey.slice(begin.length, publicKey.length - end.length).trim();
            decodedOperator = (0, js_base64_1.decode)(content);
        }
        catch (error) {
            throw new Error("Failed to decode the RSA public key. Ensure it's correctly base64 encoded.");
        }
        try {
            encrypt.setPublicKey(decodedOperator);
        }
        catch (error) {
            throw new Error("Invalid operator key format, make sure the operator exists in the network.");
        }
    }
    catch (error) {
        throw new operator_1.OperatorPublicKeyError({
            rsa: decodedOperator,
            base64: publicKey,
        }, error.message);
    }
    return true;
};
exports.operatorPublicKeyValidator = operatorPublicKeyValidator;
//# sourceMappingURL=operator.js.map