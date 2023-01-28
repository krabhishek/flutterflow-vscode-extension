import * as vscode from "vscode";
import * as os from "os";
import { execShell } from "./executeShell";

const downloadCode = async (config: {withAssets: boolean}) => {
    vscode.window.showInformationMessage(
      "Starting flutterflow code download..."
    );
    const token =
      process.env.FLUTTERFLOW_API_TOKEN ||
      vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
    const projectId =
      process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
      vscode.workspace.getConfiguration("flutterflow").get("activeProject");
    let path =
      process.env.FLUTTERFLOW_WORKING_DIR ||
      vscode.workspace
        .getConfiguration("flutterflow")
        .get("workingDirectory");
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
       await execShell(
        "dart pub global activate flutterflow_cli"
      );

      let downloadPath;
      if(os.platform()== "win32") {
        downloadPath = `%TMP%\\flutterflow`
      } else {
        downloadPath = `${os.tmpdir()}/flutterflow`
      }

      await execShell(
        `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${downloadPath} --include-assets --token ${token}`
      );
      const folderName = projectId.replace("-", "_").slice(0, projectId.lastIndexOf("-"));

      
      if(os.platform() == 'win32') {
        await execShell(`move /Y ${downloadPath}\\${folderName} ${path}`)
        console.log("Copied all files")
      } else {
        await execShell(`cp -rf ${downloadPath}/${folderName}`)
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
  }

  export {downloadCode}