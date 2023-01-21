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
        if (path.startsWith("$")) {
          path = process.env.PWD;
        }
        const activateCli = await execShell(
          "dart pub global activate flutterflow_cli"
        );

        const randomPath = Math.floor(Math.random() * 100000000);

        await execShell(
          `dart pub global run flutterflow_cli export-code --project ${projectId} --dest ${path}/${randomPath} --include-assets --token ${token}`
        );
        let folderName = await execShell(`cd ${path}/${randomPath} && ls`);
        folderName = folderName.trim();

        await await execShell(
          `cp -rf ${path}/${randomPath}/${folderName}/ ${path}`
        );

        await execShell(`rm -rf ${path}/${randomPath}`);

        vscode.window.showInformationMessage("Code download successful");
        console.log(sync);
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
  );
  context.subscriptions.push(sync);
}

// This method is called when your extension is deactivated
export function deactivate() {}
