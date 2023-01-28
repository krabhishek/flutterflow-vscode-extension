"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const codedownload_1 = require("./helperFunctions/codedownload");
function activate(context) {
    let syncWithAssets = vscode.commands.registerCommand("flutterflow-code-export.sync", async () => { (0, codedownload_1.downloadCode)({ withAssets: true }); });
    let syncWithoutAssets = vscode.commands.registerCommand("flutterflow-code-export.syncFast", async () => { (0, codedownload_1.downloadCode)({ withAssets: false }); });
    context.subscriptions.push(syncWithAssets);
    context.subscriptions.push(syncWithoutAssets);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map