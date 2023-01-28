"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitStash = exports.shouldStash = exports.isGitinitalized = exports.initalizeGit = void 0;
const vscode = require("vscode");
const executeShell_1 = require("./executeShell");
const pathHelpers_1 = require("./pathHelpers");
async function initalizeGit() {
    const projectWorkingDir = (0, pathHelpers_1.getProjectWorkingDir)();
    try {
        if (!(await isGitinitalized())) {
            console.log(`cd "${projectWorkingDir}" && git init`);
            const status = await (0, executeShell_1.execShell)(`cd "${projectWorkingDir}" && git init`);
            console.log(status);
            vscode.window.showInformationMessage("Successfully initalized git");
        }
        else {
            vscode.window.showInformationMessage("Git is already initialized");
        }
    }
    catch (err) {
        vscode.window.showErrorMessage("Git Initalize failed");
        vscode.window.showErrorMessage(err);
        throw (err);
    }
}
exports.initalizeGit = initalizeGit;
async function isGitinitalized() {
    const projectWorkingDir = (0, pathHelpers_1.getProjectWorkingDir)();
    try {
        await (0, executeShell_1.execShell)(`cd "${projectWorkingDir}" && git status`);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.isGitinitalized = isGitinitalized;
async function shouldStash() {
    let shouldStashFlag = false;
    const projectWorkingDir = (0, pathHelpers_1.getProjectWorkingDir)();
    try {
        if (!(await isGitinitalized())) {
            return false;
        }
        const status = await (0, executeShell_1.execShell)(`cd "${projectWorkingDir}" && git status`);
        if (status.includes("Untracked files")) {
            console.log(status.includes("Untracked files"));
            shouldStashFlag = true;
        }
        if (status.includes("Changes to be committed")) {
            console.log(status.includes("Changes to be committed"));
            shouldStashFlag = true;
        }
        return shouldStashFlag;
    }
    catch (err) {
        throw (err);
    }
}
exports.shouldStash = shouldStash;
async function gitStash() {
    const projectWorkingDir = (0, pathHelpers_1.getProjectWorkingDir)();
    try {
        if (await shouldStash()) {
            const status = await (0, executeShell_1.execShell)(`cd "${projectWorkingDir}" && git stash`);
            vscode.window.showInformationMessage("Stashed changes. Use git stash pop to restore");
        }
    }
    catch (err) {
        vscode.window.showErrorMessage("Could not stashed changes");
        throw (err);
    }
}
exports.gitStash = gitStash;
//# sourceMappingURL=gitHelpers.js.map