"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const codedownload_1 = require("./helperFunctions/codedownload");
const pathHelpers_1 = require("./helperFunctions/pathHelpers");
function activate(context) {
    const syncWithAssets = vscode.commands.registerCommand("flutterflow-code-export.sync", async () => {
        (0, codedownload_1.downloadCode)({ withAssets: true });
    });
    const syncWithoutAssets = vscode.commands.registerCommand("flutterflow-code-export.syncFast", async () => {
        (0, codedownload_1.downloadCode)({ withAssets: false });
    });
    const flutterRun = vscode.commands.registerCommand("flutterflow-code-export.run", async () => {
        const selectedDevice = vscode.workspace
            .getConfiguration("flutterflow")
            .get("device");
        if (selectedDevice === undefined) {
            vscode.window.showErrorMessage("Device for flutter run is not defined");
        }
        let projectId = process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
            vscode.workspace.getConfiguration("flutterflow").get("activeProject");
        if (projectId === "" || projectId === undefined) {
            const userInput = await vscode.window.showInputBox({
                placeHolder: "Your FlutterFlow Project ID",
                prompt: "Please enter your FlutterFlow project ID",
            });
            projectId = userInput;
        }
        let baseDir = process.env.FLUTTERFLOW_HOME_DIR ||
            vscode.workspace.getConfiguration("flutterflow").get("baseDirectory");
        if (baseDir === "" || baseDir === undefined) {
            vscode.window.showInformationMessage("Your FlutterFlow HOME is not set. \nDownloading it current directory");
            baseDir = ".";
        }
        if (projectId !== "" || projectId !== undefined) {
            const term = vscode.window.createTerminal("flutterflow");
            term.show(true);
            term.sendText(`cd "${(0, pathHelpers_1.getProjectWorkingDir)(projectId, baseDir)}"`);
            term.sendText(`flutter run -d ${selectedDevice}`);
        }
        else {
            vscode.window.showErrorMessage("Your FlutterFlow project ID is not set.");
        }
    });
    context.subscriptions.push(syncWithAssets);
    context.subscriptions.push(syncWithoutAssets);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map