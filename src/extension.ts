import * as vscode from "vscode";
import * as shell from "shelljs";
import { downloadCode } from "./helperMethods/codeDownload";
import {
  isDartInstalled,
  isFlutterInstalled,
} from "./helperMethods/validations";
import { isGitInitalized, shouldStash } from "./helperMethods/gitOperations";

export function activate(context: vscode.ExtensionContext) {
  const syncWithAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.sync",
    async () => {
      if (!isDartInstalled()) {
        vscode.window.showErrorMessage("Dart is not installed");
        return;
      } else {
        vscode.window.showInformationMessage("Dart is installed");
      }

      if (!isFlutterInstalled()) {
        vscode.window.showErrorMessage("Flutter is not installed");
        return;
      } else {
        vscode.window.showInformationMessage("Flutter is installed");
      }
      downloadCode({ withAssets: true });
    }
  );

  const syncWithoutAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.syncFast",
    async () => {
      if (!isDartInstalled()) {
        vscode.window.showErrorMessage("Dart is not installed");
        return;
      } else {
        vscode.window.showInformationMessage("Dart is installed");
      }

      if (!isFlutterInstalled()) {
        vscode.window.showErrorMessage("Flutter is not installed");
        return;
      } else {
        vscode.window.showInformationMessage("Flutter is installed");
      }
      downloadCode({ withAssets: false });
    }
  );

  const flutterRun = vscode.commands.registerCommand(
    "flutterflow-code-export.run",
    async () => {
      const selectedDevice = vscode.workspace
        .getConfiguration("flutterflow")
        .get("device");
      const term = vscode.window.createTerminal("flutterflow");
      term.show(true);
      term.sendText(
        `cd ${vscode.workspace
          .getConfiguration("flutterflow")
          .get("workingDirectory")}`
      );
      term.sendText(`flutter run -d ${selectedDevice}`);
    }
  );
  context.subscriptions.push(syncWithAssets);
  context.subscriptions.push(syncWithoutAssets);
  context.subscriptions.push(flutterRun);
}

// This method is called when your extension is deactivated
export function deactivate() {}
