import * as vscode from "vscode";
import * as os from "os";
import { execShell } from "./executeShell";
import { getProjectFolder, getProjectWorkingDir } from "./pathHelpers";
import {
  gitStash,
  initalizeGit,
  isGitinitalized,
  shouldStash,
} from "./gitHelpers";

const downloadCode = async (config: { withAssets: boolean }) => {
  vscode.window.showInformationMessage("Starting flutterflow code download...");
  const token =
    process.env.FLUTTERFLOW_API_TOKEN ||
    vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
  const projectId =
    process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
    vscode.workspace.getConfiguration("flutterflow").get("activeProject");
  const useGit =
    (process.env.FLUTTERFLOW_USE_GIT as unknown as boolean) ||
    (vscode.workspace.getConfiguration("flutterflow").get("useGit") as boolean);

  const openWindow =
    (process.env.FLUTTERFLOW_OPEN_DIR as unknown as boolean) ||
    (vscode.workspace
      .getConfiguration("flutterflow")
      .get("openDirectory") as boolean);

  let useGitFlag;
  if (useGit === undefined) {
    useGitFlag = false;
  } else {
    useGitFlag = useGit;
  }

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

    let downloadPath;
    if (os.platform() == "win32") {
      downloadPath = `%TMP%\\flutterflow`;
    } else {
      downloadPath = `${os.tmpdir()}/flutterflow`;
    }
    if (config.withAssets == true) {
      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${downloadPath} --include-assets --token ${token}`
      );
    } else {
      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${downloadPath} --no-include-assets --token ${token}`
      );
    }

    const folderName = getProjectFolder();
    if (useGitFlag) {
      try {
        if (await shouldStash()) {
          await gitStash();
        }
      } catch (err) {
        vscode.window.showErrorMessage("Could not stash current files");
        vscode.window.showErrorMessage(err as string);
      }
    }

    if (os.platform() == "win32") {
      await execShell(
        `xcopy /h /i /c /k /e /r /y  ${downloadPath}\\${folderName} ${path}\\${folderName}`
      );
      console.log("Copied all files");
    } else {
      await execShell(
        `cp -rf ${downloadPath}/${folderName} ${path}/${folderName}`
      );
    }

    if (useGitFlag) {
      try {
        if (!(await isGitinitalized())) {
          await initalizeGit();
        }
      } catch (err) {
        vscode.window.showErrorMessage(
          "Could initialize git in project directory"
        );
        vscode.window.showErrorMessage(err as string);
      }
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
