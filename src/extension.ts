import * as vscode from "vscode";
import { downloadCode } from "./helperFunctions/codedownload";
import { initalizeGit, shouldStash } from "./helperFunctions/gitHelpers";


export function activate(context: vscode.ExtensionContext) {
  let syncWithAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.sync",
    async () => {downloadCode({withAssets: true})})

  let syncWithoutAssets = vscode.commands.registerCommand(
    "flutterflow-code-export.syncFast",
    async () => {downloadCode({withAssets: false})})

    let gitInitialize = vscode.commands.registerCommand(
      "flutterflow-code-export.gitInitalize",
      async () => {
        console.log(await initalizeGit());
        console.log(await shouldStash());
      })
  context.subscriptions.push(syncWithAssets);
  context.subscriptions.push(syncWithoutAssets);
  context.subscriptions.push(gitInitialize);
}

// This method is called when your extension is deactivated
export function deactivate() {}
