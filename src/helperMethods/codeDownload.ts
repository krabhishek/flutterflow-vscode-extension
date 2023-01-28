import * as vscode from "vscode";
import { tmpdir, platform } from "os";
import * as shell from "shelljs";
import { execShell } from "./executeShellCmd";
import { isGitInitalized, shouldStash } from "./gitOperations";
import { openStdin } from "process";

shell.config.execPath = shell.which("node");

export async function downloadCode(config: { withAssets: boolean }) {
  vscode.window.showInformationMessage("Starting flutterflow code download...");
  const token =
    process.env.FLUTTERFLOW_API_TOKEN ||
    vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
  const projectId =
    process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
    vscode.workspace.getConfiguration("flutterflow").get("activeProject");
  const path =
    process.env.FLUTTERFLOW_WORKING_DIR ||
    vscode.workspace.getConfiguration("flutterflow").get("workingDirectory");

  let useGit =
    (process.env.FLUTTERFLOW_USE_GIT as unknown as boolean) ||
    (vscode.workspace
      .getConfiguration("flutterflow")
      .get("useGit") as unknown as boolean);

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

    if (useGit === undefined) {
      useGit = false;
    }

    execShell("dart pub global activate flutterflow_cli");

    const randomPathSuffix = Math.floor(Math.random() * 100000000);
    const tmpPath = `${tmpdir()}/${randomPathSuffix}`;
    if (config.withAssets == true) {
      execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpPath} --include-assets --token ${token}`
      );
    } else {
      execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpPath} --no-include-assets --token ${token}`
      );
    }
    let folderName;

    if (useGit) {
      if (!(await isGitInitalized(path))) {
        console.log("got not initialized");
        await execShell(`cd ${path} && git init`);
      }
      if (!(await shouldStash(path))) {
        execShell("git stash");
      }
    }

    shell.rm("-rf", `${tmpPath}/${folderName}`);

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
