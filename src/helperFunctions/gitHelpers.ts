import * as os from "os";
import * as vscode from "vscode";
import { execShell } from "./executeShell";
import { getProjectWorkingDir } from "./pathHelpers";

async function initalizeGit() {
  const projectWorkingDir = getProjectWorkingDir();
  try {
    if (!(await isGitinitalized())) {
      console.log(`cd "${projectWorkingDir}" && git init`);
      const status = await execShell(`cd "${projectWorkingDir}" && git init`);
      console.log(status);
      vscode.window.showInformationMessage("Successfully initalized git");
    } else {
      vscode.window.showInformationMessage("Git is already initialized");
    }
  } catch (err) {
    vscode.window.showErrorMessage("Git Initalize failed");
    vscode.window.showErrorMessage(err as string);
    throw err;
  }
}

async function isGitinitalized(): Promise<boolean> {
  const projectWorkingDir = getProjectWorkingDir();
  try {
    await execShell(`cd "${projectWorkingDir}" && git status`);
    return true;
  } catch (err) {
    return false;
  }
}

async function shouldStash(): Promise<boolean> {
  let shouldStashFlag = false;
  const projectWorkingDir = getProjectWorkingDir();
  try {
    if (!(await isGitinitalized())) {
      return false;
    }
    const status = await execShell(`cd "${projectWorkingDir}" && git status`);
    if (status.includes("Untracked files")) {
      console.log(status.includes("Untracked files"));
      shouldStashFlag = true;
    }
    if (status.includes("Changes to be committed")) {
      console.log(status.includes("Changes to be committed"));
      shouldStashFlag = true;
    }
    return shouldStashFlag;
  } catch (err) {
    throw err;
  }
}

async function gitStash() {
  const projectWorkingDir = getProjectWorkingDir();
  try {
    if (await shouldStash()) {
      const status = await execShell(`cd "${projectWorkingDir}" && git stash`);
      vscode.window.showInformationMessage(
        "Stashed changes. Use git stash pop to restore"
      );
    }
  } catch (err) {
    vscode.window.showErrorMessage("Could not stashed changes");
    throw err;
  }
}

export { initalizeGit, isGitinitalized, shouldStash, gitStash };
