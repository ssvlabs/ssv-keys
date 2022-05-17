"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
const crypto_1 = tslib_1.__importDefault(require("crypto"));
require("jsdom-global/register");
require("@testing-library/jest-dom/extend-expect");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.crypto = {
    getRandomValues: function (buffer) {
        return crypto_1.default.randomFillSync(buffer);
    }
};
//# sourceMappingURL=setupTests.js.map