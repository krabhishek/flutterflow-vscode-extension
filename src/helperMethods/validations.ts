import * as shell from "shelljs";

shell.config.execPath = shell.which("node");

const isDartInstalled = (): boolean => {
  if (shell.which("dart") != null) {
    return true;
  }
  return false;
};

const isFlutterInstalled = (): boolean => {
  if (shell.which("flutter") != null) {
    return true;
  }
  return false;
};

export { isDartInstalled, isFlutterInstalled };
