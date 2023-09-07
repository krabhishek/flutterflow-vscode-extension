import * as vscode from "vscode";
import * as os from "os";
import { execShell } from "./executeShell";
import {
  getProjectFolder,
  getProjectWorkingDir,
  tmpDownloadFolder,
} from "./pathHelpers";
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
    const indiaToken =
    process.env.FLUTTERFLOW_API_TOKEN ||
    vscode.workspace.getConfiguration("flutterflow").get("userApiTokenIndia");
  const projectId =
    process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
    vscode.workspace.getConfiguration("flutterflow").get("activeProject");
  const useGit =
    (process.env.FLUTTERFLOW_USE_GIT as unknown as boolean) ||
    (vscode.workspace.getConfiguration("flutterflow").get("useGit") as boolean);
  const isEnterpriseIndia =
    (vscode.workspace
      .getConfiguration("flutterflow")
      .get("platformEnterpriseIndia") as boolean);

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

    const endpoint = isEnterpriseIndia
      ? "--endpoint 'https://api-enterprise-india.flutterflow.io/v1'" // Empty string for default endpoint
      : ""; // Empty string for default endpoint

    if (config.withAssets == true) {
      const exportCommand = isEnterpriseIndia
        ? `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpDownloadFolder()} --include-assets --token ${indiaToken} ${endpoint}`
        : `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpDownloadFolder()} --include-assets --token ${token}`;
      
      await execShell(exportCommand);
    } else {
      const exportCommand = isEnterpriseIndia
        ? `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpDownloadFolder()} --no-include-assets --token ${indiaToken} ${endpoint}`
        : `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${tmpDownloadFolder()} --no-include-assets --token ${token}`;
      
      await execShell(exportCommand);
    }

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
        `xcopy /h /i /c /k /e /r /y  ${tmpDownloadFolder()}\\${getProjectFolder()} ${getProjectWorkingDir()}`
      );
      console.log("Copied all files");
    } else {
      await execShell(
        `cp -rf "${tmpDownloadFolder()}/${getProjectFolder()}/" "${getProjectWorkingDir()}"`
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
