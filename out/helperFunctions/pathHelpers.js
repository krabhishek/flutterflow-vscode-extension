"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectConfig = exports.getProjectWorkingDir = void 0;
const os = require("os");
const vscode = require("vscode");
function validateProjectConfig(projectId) {
    if (projectId === "" || projectId === undefined) {
        vscode.window.showErrorMessage("Your flutterflow project ID not set. Please set Please set in vscode settings.");
        return false;
    }
    return true;
}
exports.validateProjectConfig = validateProjectConfig;
function getProjectWorkingDir(projectId, baseDir) {
    if (!validateProjectConfig(projectId)) {
        return undefined;
    }
    if (baseDir === "" || baseDir === undefined) {
        baseDir = ".";
    }
    if (os.platform() === "win32") {
        console.log(`getProjectWorkingDir : ${baseDir}\\${projectId} `);
        return `${baseDir}\\${projectId}`;
    }
    else {
        console.log(`getProjectWorkingDir : ${baseDir}/${projectId} `);
        return `${baseDir}/${projectId}`;
    }
}
exports.getProjectWorkingDir = getProjectWorkingDir;
//# sourceMappingURL=pathHelpers.js.map