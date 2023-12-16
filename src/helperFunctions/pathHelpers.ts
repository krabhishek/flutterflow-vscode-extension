import * as os from "os";
import * as vscode from "vscode";


function validateProjectConfig(projectId: string): boolean {
  if (projectId === "" || projectId === undefined) { 
    vscode.window.showErrorMessage(
      "Your flutterflow project ID not set. Please set Please set in vscode settings."
    );
    return false;
  }
  return true;
}

function getProjectWorkingDir(projectId: string, baseDir: string): string | undefined {
  if (!validateProjectConfig(projectId)) {
    return undefined;
  }

  if(baseDir === "" || baseDir === undefined) {
    baseDir = ".";
  }

  if (os.platform() === "win32") {
    console.log(`getProjectWorkingDir : ${baseDir}\\${projectId} `);
    return `${baseDir}\\${projectId}`;
  } else {
    console.log(`getProjectWorkingDir : ${baseDir}/${projectId} `);
    return `${baseDir}/${projectId}`;
  }
}


export {
  getProjectWorkingDir,
  validateProjectConfig
};
