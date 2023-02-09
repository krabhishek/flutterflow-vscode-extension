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

  if (os.platform() == "win32") {
    console.log(`getProjectWorkingDir : ${baseDir}\\${getProjectFolder()} `);
    return `${baseDir}\\${getProjectFolder()}`;
  } else {
    console.log(`getProjectWorkingDir : ${baseDir}/${getProjectFolder()} `);
    return `${baseDir}/${getProjectFolder()}`;
  }
}

function tmpDownloadFolder(): string {
  if (os.platform() == "win32") {
    return `%TMP%\\flutterflow`;
  } else {
    return `${os.tmpdir()}/flutterflow`;
  }
}

function getProjectFolder(): string | undefined {
  if (!validatePathConfig()) {
    return undefined;
  }
  const re = /-/gi;
  const folderName = projectId
    .replace(re, "_")
    .slice(0, projectId.lastIndexOf("-"));
  return folderName;
}

export {
  getProjectWorkingDir,
  validatePathConfig,
  getProjectFolder,
  tmpDownloadFolder,
};
