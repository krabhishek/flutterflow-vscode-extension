"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execShell = void 0;
const cp = require("child_process");
// this function would execute the shell commands
const execShell = (cmd) => new Promise((resolve, reject) => {
    cp.exec(cmd, (err, out) => {
        if (err) {
            return reject(err);
        }
        return resolve(out);
    });
});
exports.execShell = execShell;
//# sourceMappingURL=executeShellCmd.js.map