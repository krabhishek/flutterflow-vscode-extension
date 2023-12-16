"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectFolder = exports.validatePathConfig = exports.getProjectWorkingDir = void 0;
const os = require("os");
const vscode = require("vscode");
const projectId = process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
    vscode.workspace
        .getConfiguration("flutterflow")
        .get("activeProject");
const baseDir = process.env.FLUTTERFLOW_BASE_DIR ||
    vscode.workspace
        .getConfiguration("flutterflow")
        .get("baseDirectory");
function validatePathConfig() {
    if (projectId === "" || projectId === undefined) {
        vscode.window.showErrorMessage("Your flutterflow project ID not set. Please set Please set in vscode settings.");
        return false;
    }
    if (baseDir === "" || baseDir === undefined) {
        vscode.window.showErrorMessage("Your flutterflow working directory is not set. Please set in vscode settings.");
        return false;
    }
    return true;
}
exports.validatePathConfig = validatePathConfig;
function getProjectWorkingDir() {
    if (!validatePathConfig()) {
        return undefined;
    }
    if (os.platform() === "win32") {
        console.log(`getProjectWorkingDir : ${baseDir}\\${getProjectFolder()} `);
        return `${baseDir}\\${getProjectFolder()}`;
    }
    else {
        console.log(`getProjectWorkingDir : ${baseDir}/${getProjectFolder()} `);
        return `${baseDir}/${getProjectFolder()}`;
    }
}
exports.getProjectWorkingDir = getProjectWorkingDir;
function getProjectFolder() {
    if (!validatePathConfig()) {
        return undefined;
    }
    return projectId;
}
exports.getProjectFolder = getProjectFolder;
//# sourceMappingURL=pathHelpers.js.map