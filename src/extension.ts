import * as os from "os";
import * as vscode from "vscode";
import { downloadCode } from "./helperFunctions/codedownload";
import { initalizeGit, shouldStash } from "./helperFunctions/gitHelpers";
import {
  getProjectFolder,
  getProjectWorkingDir,
} from "./helperFunctions/pathHelpers";

export function activate(context: vscode.ExtensionContext) {
  const syncWithAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.sync",
    async () => {
      downloadCode({ withAssets: true });
    }
  );

  const syncWithoutAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.syncFast",
    async () => {
      downloadCode({ withAssets: false });
    }
  );

  let gitInitialize = vscode.commands.registerCommand(
    "flutterflow-code-export.gitInitalize",
    async () => {
      console.log(await initalizeGit());
      console.log(await shouldStash());
    }
  );

  const flutterRun = vscode.commands.registerCommand(
    "flutterflow-code-export.run",
    async () => {
      const selectedDevice = vscode.workspace
        .getConfiguration("flutterflow")
        .get("device");
      if (selectedDevice === undefined) {
        vscode.window.showErrorMessage("Device for flutter run is not defined");
      }

      const term = vscode.window.createTerminal("flutterflow");
      term.show(true);
      term.sendText(`cd "${getProjectWorkingDir()}"`);
      term.sendText(`flutter run -d ${selectedDevice}`);
    }
  );

  context.subscriptions.push(syncWithAssets);
  context.subscriptions.push(syncWithoutAssets);
  context.subscriptions.push(gitInitialize);
}

// This method is called when your extension is deactivated
export function deactivate() {}
