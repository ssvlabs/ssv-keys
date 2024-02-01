"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sharesSignatures = void 0;
const tslib_1 = require("tslib");
const BLS_1 = tslib_1.__importDefault(require("../../../BLS"));
const Threshold_1 = tslib_1.__importDefault(require("../../../Threshold"));
const sharesSignatures = async (_privateKey, operators, message, isThreshold) => {
    if (!BLS_1.default.deserializeHexStrToSecretKey) {
        await BLS_1.default.init(BLS_1.default.BLS12_381);
    }
    const threshold = await new Threshold_1.default().create(_privateKey, operators);
    const privateKey = BLS_1.default.deserializeHexStrToSecretKey(_privateKey.replace('0x', ''));
    const publicKey = privateKey.getPublicKey();
    const signatures = [];
    const ids = [];
    const randomIndex = getRandomInt(4);
    threshold.shares.forEach((share, index) => {
        if (isThreshold && index === randomIndex) {
            return;
        }
        const sharePrivateKey = share.privateKey.substr(2);
        const shareBlsPrivateKey = BLS_1.default.deserializeHexStrToSecretKey(sharePrivateKey);
        signatures.push(shareBlsPrivateKey.sign(message));
        ids.push(share.id);
    });
    return {
        privateKey,
        publicKey,
        signatures,
        ids,
    };
};
exports.sharesSignatures = sharesSignatures;
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
//# sourceMappingURL=share_signatures.js.map