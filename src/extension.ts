import * as vscode from "vscode";
import * as cp from "child_process";

// this function would execute the shell commands
const execShell = (cmd: string) =>
  new Promise<string>((resolve, reject) => {
    cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });

export function activate(context: vscode.ExtensionContext) {
  let sync = vscode.commands.registerCommand(
    "flutterflow-code.sync",
    async () => {
      let token =
        process.env.FLUTTERFLOW_API_TOKEN ||
        vscode.workspace.getConfiguration("flutterflow").get("userApiToken");
      let projectId =
        process.env.FLUTTERFLOW_ACTIVE_PROJECT_ID ||
        vscode.workspace.getConfiguration("flutterflow").get("activeProject");
      try {
        if (token === "" || token === undefined) {
          vscode.window.showErrorMessage(
            "Your FlutterFlow API token is not set. Please set the FLUTTERFLOW_API_TOKEN environment variable"
          );
          const err = "FlutterFlow API token not set";
          throw err;
        }
        if (projectId === "" || projectId === undefined) {
          vscode.window.showErrorMessage(
            "Your flutterflow project ID not set. Please set the FLUTTERFLOW_ACTIVE_PROJECT environment variable"
          );
          const err = "FlutterFlow project ID not set";
          throw err;
        }
        const activateCli = await execShell(
          "dart pub global activate flutterflow_cli"
        );
        const path = `${
          __dirname.split("vscode/flutterflow-vscode-extension/out")[0]
        }`;

        console.log(path);
        const syncCode = await execShell(
          `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${path} --include-assets --token ${token}`
        );

        vscode.window.showInformationMessage("Code sync successful");
        console.log(sync);
        vscode.window.showInformationMessage(`${token} / ${projectId}`);
      } catch (err) {
        console.error(`
		Could not sync code \n
		${err}
		  `);
        vscode.window.showErrorMessage(`Could not sync code \n
		${err}
		  `);
        console.error(err);
      }
    }
  );
  context.subscriptions.push(sync);
}

// This method is called when your extension is deactivated
export function deactivate() {}
