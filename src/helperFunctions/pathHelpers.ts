import * as os from "os";
import * as vscode from "vscode";

const projectId =
  process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
  (vscode.workspace
    .getConfiguration("flutterflow")
    .get("activeProject") as string);

const baseDir =
  process.env.FLUTTERFLOW_BASE_DIR ||
  (vscode.workspace
    .getConfiguration("flutterflow")
    .get("baseDirectory") as string);

function validatePathConfig(): boolean {
  if (projectId === "" || projectId === undefined) {
    vscode.window.showErrorMessage(
      "Your flutterflow project ID not set. Please set Please set in vscode settings."
    );
    return false;
  }
  if (baseDir === "" || baseDir === undefined) {
    vscode.window.showErrorMessage(
      "Your flutterflow working directory is not set. Please set in vscode settings."
    );
    return false;
  }
  return true;
}

function getProjectWorkingDir(): string | undefined {
  if (!validatePathConfig()) {
    return undefined;
  }
  const folderName = projectId
    .replace("-", "_")
    .slice(0, projectId.lastIndexOf("-"))
    .replace("-", "_");
  if (os.platform() == "win32") {
    return `${baseDir}\\${folderName}`;
  } else {
    return `${baseDir}/${folderName}`;
  }
}

function getProjectFolder(): string | undefined {
  if (!validatePathConfig()) {
    return undefined;
  }
  const folderName = projectId
    .replace("-", "_")
    .slice(0, projectId.lastIndexOf("-"));
  return folderName;
}

export { getProjectWorkingDir, validatePathConfig, getProjectFolder };
