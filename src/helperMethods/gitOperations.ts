import * as vscode from "vscode";
import { execShell } from "./executeShellCmd";

const isGitInitalized = async (path: string): Promise<boolean> => {
  const gitStatus = await execShell(`cd ${path} && git status`);
  if (gitStatus.split("\n")[2].startsWith("No commits")) {
    return false;
  }
  return true;
};

const shouldStash = async (path: string): Promise<boolean> => {
  if (await isGitInitalized(path)) {
    return false;
  }
  const gitStatus = await execShell("git status");
  if (gitStatus.split("\n")[2].startsWith("nothing to commit")) {
    return false;
  }

  return true;
};

export { isGitInitalized, shouldStash };
