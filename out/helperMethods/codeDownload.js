"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCode = void 0;
const vscode = require("vscode");
const os_1 = require("os");
const shell = require("shelljs");
const executeShellCmd_1 = require("./executeShellCmd");
const gitOperations_1 = require("./gitOperations");
shell.config.execPath = shell.which("node");
async function downloadCode(config) {
    vscode.window.showInformationMessage("Starting flutterflow code download...");
    const token = process.env.FLUTTERFLOW_API_TOKEN ||
        vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
    const projectId = process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
        vscode.workspace.getConfiguration("flutterflow").get("activeProject");
    const path = process.env.FLUTTERFLOW_WORKING_DIR ||
        vscode.workspace.getConfiguration("flutterflow").get("workingDirectory");
    let useGit = process.env.FLUTTERFLOW_USE_GIT ||
        vscode.workspace
            .getConfiguration("flutterflow")
            .get("useGit");
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
        if (useGit === undefined) {
            useGit = false;
        }
        (0, executeShellCmd_1.execShell)("dart pub global activate flutterflow_cli");
        const randomPathSuffix = Math.floor(Math.random() * 100000000);
        const tmpPath = `${(0, os_1.tmpdir)()}/${randomPathSuffix}`;
        if (config.withAssets == true) {
            (0, executeShellCmd_1.execShell)(`dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpPath} --include-assets --token ${token}`);
        }
        else {
            (0, executeShellCmd_1.execShell)(`dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpPath} --no-include-assets --token ${token}`);
        }
        let folderName;
        if (useGit) {
            if (!(await (0, gitOperations_1.isGitInitalized)(path))) {
                console.log("got not initialized");
                await (0, executeShellCmd_1.execShell)(`cd ${path} && git init`);
            }
            if (!(await (0, gitOperations_1.shouldStash)(path))) {
                (0, executeShellCmd_1.execShell)("git stash");
            }
        }
        shell.rm("-rf", `${tmpPath}/${folderName}`);
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
    if (vscode.workspace.getConfiguration("flutterflow").get("openDirectory")) {
        await vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(`${path}`));
    }
}
exports.downloadCode = downloadCode;
//# sourceMappingURL=codeDownload.js.map