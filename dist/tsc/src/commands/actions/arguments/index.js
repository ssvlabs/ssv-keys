"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorPublicKeysArgument = exports.outputFolderArgument = exports.keystorePasswordArgument = exports.ownerAddressArgument = exports.operatorIdsArgument = exports.ownerNonceArgument = exports.keystoreArgument = void 0;
var keystore_1 = require("./keystore");
Object.defineProperty(exports, "keystoreArgument", { enumerable: true, get: function () { return __importDefault(keystore_1).default; } });
var owner_nonce_1 = require("./owner-nonce");
Object.defineProperty(exports, "ownerNonceArgument", { enumerable: true, get: function () { return __importDefault(owner_nonce_1).default; } });
var operator_ids_1 = require("./operator-ids");
Object.defineProperty(exports, "operatorIdsArgument", { enumerable: true, get: function () { return __importDefault(operator_ids_1).default; } });
var owner_address_1 = require("./owner-address");
Object.defineProperty(exports, "ownerAddressArgument", { enumerable: true, get: function () { return __importDefault(owner_address_1).default; } });
var password_1 = require("./password");
Object.defineProperty(exports, "keystorePasswordArgument", { enumerable: true, get: function () { return __importDefault(password_1).default; } });
var output_folder_1 = require("./output-folder");
Object.defineProperty(exports, "outputFolderArgument", { enumerable: true, get: function () { return __importDefault(output_folder_1).default; } });
var operator_public_keys_1 = require("./operator-public-keys");
Object.defineProperty(exports, "operatorPublicKeysArgument", { enumerable: true, get: function () { return __importDefault(operator_public_keys_1).default; } });
//# sourceMappingURL=index.js.map