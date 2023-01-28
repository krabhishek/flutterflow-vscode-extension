import * as vscode from "vscode";
import { downloadCode } from "./commands/codeDownload";

export function activate(context: vscode.ExtensionContext) {
  const syncWithAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.sync",
    async () => downloadCode({ withAssets: true })
  );

  const syncWithoutAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.syncFast",
    async () => downloadCode({ withAssets: false })
  );
  context.subscriptions.push(syncWithAssets);
  context.subscriptions.push(syncWithoutAssets);
}

// This method is called when your extension is deactivated
export function deactivate() {}
