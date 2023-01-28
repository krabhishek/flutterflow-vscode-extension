"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const codeDownload_1 = require("./commands/codeDownload");
function activate(context) {
    const syncWithAssets = vscode.commands.registerCommand("flutterflow-code-export.sync", async () => (0, codeDownload_1.downloadCode)({ withAssets: true }));
    const syncWithoutAssets = vscode.commands.registerCommand("flutterflow-code-export.syncFast", async () => (0, codeDownload_1.downloadCode)({ withAssets: false }));
    context.subscriptions.push(syncWithAssets);
    context.subscriptions.push(syncWithoutAssets);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map