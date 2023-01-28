"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCode = void 0;
const vscode = require("vscode");
const os = require("os");
const executeShell_1 = require("./executeShell");
const pathHelpers_1 = require("./pathHelpers");
const gitHelpers_1 = require("./gitHelpers");
const downloadCode = async (config) => {
    vscode.window.showInformationMessage("Starting flutterflow code download...");
    const token = process.env.FLUTTERFLOW_API_TOKEN ||
        vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
    const projectId = process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
        vscode.workspace.getConfiguration("flutterflow").get("activeProject");
    const useGit = process.env.FLUTTERFLOW_USE_GIT ||
        vscode.workspace.getConfiguration("flutterflow").get("useGit");
    const openWindow = process.env.FLUTTERFLOW_OPEN_DIR ||
        vscode.workspace
            .getConfiguration("flutterflow")
            .get("openDirectory");
    let useGitFlag;
    if (useGit === undefined) {
        useGitFlag = false;
    }
    else {
        useGitFlag = useGit;
    }
    const path = process.env.FLUTTERFLOW_BASE_DIR ||
        vscode.workspace.getConfiguration("flutterflow").get("baseDirectory");
    try {
        if (token === "" || token === undefined) {
            vscode.window.showErrorMessage("Your FlutterFlow API token is not set. Please set in vscode settings.");
            const err = "FlutterFlow API token not set";
            throw err;
        }
        if (projectId === "" || projectId === undefined) {
            vscode.window.showErrorMessage("Your flutterflow project ID not set. Please set Please set in vscode settings.");
            const err = "FlutterFlow project ID not set";
            throw err;
        }
        if (path === "" || path === undefined) {
            vscode.window.showErrorMessage("Your flutterflow working directory is not set. Please set in vscode settings.");
            const err = "FlutterFlow working directory not set";
            throw err;
        }
        await (0, executeShell_1.execShell)("dart pub global activate flutterflow_cli");
        let downloadPath;
        if (os.platform() == "win32") {
            downloadPath = `%TMP%\\flutterflow`;
        }
        else {
            downloadPath = `${os.tmpdir()}/flutterflow`;
        }
        if (config.withAssets == true) {
            await (0, executeShell_1.execShell)(`dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${downloadPath} --include-assets --token ${token}`);
        }
        else {
            await (0, executeShell_1.execShell)(`dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${downloadPath} --no-include-assets --token ${token}`);
        }
        const folderName = (0, pathHelpers_1.getProjectFolder)();
        if (useGitFlag) {
            try {
                if (await (0, gitHelpers_1.shouldStash)()) {
                    await (0, gitHelpers_1.gitStash)();
                }
            }
            catch (err) {
                vscode.window.showErrorMessage("Could not stash current files");
                vscode.window.showErrorMessage(err);
            }
        }
        if (os.platform() == "win32") {
            await (0, executeShell_1.execShell)(`xcopy /h /i /c /k /e /r /y  ${downloadPath}\\${folderName} ${path}\\${folderName}`);
            console.log("Copied all files");
        }
        else {
            await (0, executeShell_1.execShell)(`cp -rf ${downloadPath}/${folderName} ${path}/${folderName}`);
        }
        if (useGitFlag) {
            try {
                if (!(await (0, gitHelpers_1.isGitinitalized)())) {
                    await (0, gitHelpers_1.initalizeGit)();
                }
            }
            catch (err) {
                vscode.window.showErrorMessage("Could initialize git in project directory");
                vscode.window.showErrorMessage(err);
            }
        }
        if (openWindow === true) {
            const folderUri = vscode.Uri.file((0, pathHelpers_1.getProjectWorkingDir)());
            vscode.commands.executeCommand(`vscode.openFolder`, folderUri);
        }
        vscode.window.showInformationMessage("Code download successful");
    }
    catch (err) {
        console.error(`
      Could not sync code \n
      ${err}
        `);
        vscode.window.showErrorMessage(`Could not download code \n
      ${err}
        `);
        console.error(err);
    }
};
exports.downloadCode = downloadCode;
//# sourceMappingURL=codedownload.js.map