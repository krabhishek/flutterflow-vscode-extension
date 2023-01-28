"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const codedownload_1 = require("./helperFunctions/codedownload");
const gitHelpers_1 = require("./helperFunctions/gitHelpers");
const pathHelpers_1 = require("./helperFunctions/pathHelpers");
function activate(context) {
    const syncWithAssets = vscode.commands.registerCommand("flutterflow-code-export.sync", async () => {
        (0, codedownload_1.downloadCode)({ withAssets: true });
    });
    const syncWithoutAssets = vscode.commands.registerCommand("flutterflow-code-export.syncFast", async () => {
        (0, codedownload_1.downloadCode)({ withAssets: false });
    });
    let gitInitialize = vscode.commands.registerCommand("flutterflow-code-export.gitInitalize", async () => {
        console.log(await (0, gitHelpers_1.initalizeGit)());
        console.log(await (0, gitHelpers_1.shouldStash)());
    });
    const flutterRun = vscode.commands.registerCommand("flutterflow-code-export.run", async () => {
        const selectedDevice = vscode.workspace
            .getConfiguration("flutterflow")
            .get("device");
        if (selectedDevice === undefined) {
            vscode.window.showErrorMessage("Device for flutter run is not defined");
        }
        const term = vscode.window.createTerminal("flutterflow");
        term.show(true);
        term.sendText(`cd "${(0, pathHelpers_1.getProjectWorkingDir)()}"`);
        term.sendText(`flutter run -d ${selectedDevice}`);
    });
    context.subscriptions.push(syncWithAssets);
    context.subscriptions.push(syncWithoutAssets);
    context.subscriptions.push(gitInitialize);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map