"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const codeDownload_1 = require("./helperMethods/codeDownload");
const validations_1 = require("./helperMethods/validations");
function activate(context) {
    const syncWithAssets = vscode.commands.registerCommand("flutterflow-code-export.sync", async () => {
        if (!(0, validations_1.isDartInstalled)()) {
            vscode.window.showErrorMessage("Dart is not installed");
            return;
        }
        else {
            vscode.window.showInformationMessage("Dart is installed");
        }
        if (!(0, validations_1.isFlutterInstalled)()) {
            vscode.window.showErrorMessage("Flutter is not installed");
            return;
        }
        else {
            vscode.window.showInformationMessage("Flutter is installed");
        }
        (0, codeDownload_1.downloadCode)({ withAssets: true });
    });
    const syncWithoutAssets = vscode.commands.registerCommand("flutterflow-code-export.syncFast", async () => {
        if (!(0, validations_1.isDartInstalled)()) {
            vscode.window.showErrorMessage("Dart is not installed");
            return;
        }
        else {
            vscode.window.showInformationMessage("Dart is installed");
        }
        if (!(0, validations_1.isFlutterInstalled)()) {
            vscode.window.showErrorMessage("Flutter is not installed");
            return;
        }
        else {
            vscode.window.showInformationMessage("Flutter is installed");
        }
        (0, codeDownload_1.downloadCode)({ withAssets: false });
    });
    const flutterRun = vscode.commands.registerCommand("flutterflow-code-export.run", async () => {
        const selectedDevice = vscode.workspace
            .getConfiguration("flutterflow")
            .get("device");
        const term = vscode.window.createTerminal("flutterflow");
        term.show(true);
        term.sendText(`cd ${vscode.workspace
            .getConfiguration("flutterflow")
            .get("workingDirectory")}`);
        term.sendText(`flutter run -d ${selectedDevice}`);
    });
    context.subscriptions.push(syncWithAssets);
    context.subscriptions.push(syncWithoutAssets);
    context.subscriptions.push(flutterRun);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map