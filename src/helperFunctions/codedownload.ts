import * as vscode from "vscode";
import * as os from "os";
import { execShell } from "./executeShell";
import {
  getProjectFolder,
  getProjectWorkingDir,
} from "./pathHelpers";

const downloadCode = async (config: { withAssets: boolean }) => {
  vscode.window.showInformationMessage("Starting flutterflow code download...");
  const token =
    process.env.FLUTTERFLOW_API_TOKEN ||
    vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
  const projectId =
    process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
    vscode.workspace.getConfiguration("flutterflow").get("activeProject");

  const openWindow =
    (process.env.FLUTTERFLOW_OPEN_DIR as unknown as boolean) ||
    (vscode.workspace
      .getConfiguration("flutterflow")
      .get("openDirectory") as boolean);


  const path =
    process.env.FLUTTERFLOW_BASE_DIR ||
    vscode.workspace.getConfiguration("flutterflow").get("baseDirectory");
  try {
    if (token === "" || token === undefined) {
      vscode.window.showErrorMessage(
        "Your FlutterFlow API token is not set. Please set in vscode settings."
      );
      const err = "FlutterFlow API token not set";
      throw err;
    }
    if (projectId === "" || projectId === undefined) {
      vscode.window.showErrorMessage(
        "Your flutterflow project ID not set. Please set Please set in vscode settings."
      );
      const err = "FlutterFlow project ID not set";
      throw err;
    }
    if (path === "" || path === undefined) {
      vscode.window.showErrorMessage(
        "Your flutterflow working directory is not set. Please set in vscode settings."
      );
      const err = "FlutterFlow working directory not set";
      throw err;
    }
    await execShell("dart pub global activate flutterflow_cli");

    if (config.withAssets === true) {
      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${getProjectWorkingDir()} --include-assets --token ${token} --no-parent-folder`
      );
    } else {
      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${getProjectWorkingDir()} --no-include-assets --token ${token} --no-parent-folder`
      );
    }

    if (openWindow === true) {
      const folderUri = vscode.Uri.file(getProjectWorkingDir()!);
      vscode.commands.executeCommand(`vscode.openFolder`, folderUri);
    }

    vscode.window.showInformationMessage("Code download successful");
  } catch (err) {
    console.error(`
      Could not sync code \n
      ${err}
        `);
    vscode.window.showErrorMessage(`Could not download code \n
      ${err}
        `);
    console.error(err);
  }
};

export { downloadCode };
