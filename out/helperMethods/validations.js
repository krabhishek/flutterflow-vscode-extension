"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFlutterInstalled = exports.isDartInstalled = void 0;
const shell = require("shelljs");
shell.config.execPath = shell.which("node");
const isDartInstalled = () => {
    if (shell.which("dart") != null) {
        return true;
    }
    return false;
};
exports.isDartInstalled = isDartInstalled;
const isFlutterInstalled = () => {
    if (shell.which("flutter") != null) {
        return true;
    }
    return false;
};
exports.isFlutterInstalled = isFlutterInstalled;
//# sourceMappingURL=validations.js.map