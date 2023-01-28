import * as vscode from "vscode";
import { tmpdir } from "os";
import { execShell } from "../helperMethods/executeShellCmd";

export async function downloadCode(config: { withAssets: boolean }) {
  vscode.window.showInformationMessage("Starting flutterflow code download...");
  const token =
    process.env.FLUTTERFLOW_API_TOKEN ||
    vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
  const projectId =
    process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
    vscode.workspace.getConfiguration("flutterflow").get("activeProject");
  let path =
    process.env.FLUTTERFLOW_WORKING_DIR ||
    vscode.workspace.getConfiguration("flutterflow").get("workingDirectory");
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

    const activateCli = await execShell(
      "dart pub global activate flutterflow_cli"
    );

    const randomPathSuffix = Math.floor(Math.random() * 100000000);
    const tmpPath = `${tmpdir()}/${randomPathSuffix}`;
    if (config.withAssets == true) {
      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpPath} --include-assets --token ${token}`
      );
    } else {
      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpPath} --no-include-assets --token ${token}`
      );
    }

    const folderName = (await execShell(`cd ${tmpPath} && ls`)).trim();

    await execShell(`cp -rf ${tmpPath}/${folderName}/ ${path}`);

    await execShell(`rm -rf ${tmpPath}`);

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
  if (vscode.workspace.getConfiguration("flutterflow").get("openDirectory")) {
    await vscode.commands.executeCommand(
      "vscode.openFolder",
      vscode.Uri.file(`${path}`)
    );
  }
}
