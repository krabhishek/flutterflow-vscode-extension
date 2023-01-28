"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldStash = exports.isGitInitalized = void 0;
const executeShellCmd_1 = require("./executeShellCmd");
const isGitInitalized = async (path) => {
    const gitStatus = await (0, executeShellCmd_1.execShell)(`cd ${path} && git status`);
    if (gitStatus.split("\n")[2].startsWith("No commits")) {
        return false;
    }
    return true;
};
exports.isGitInitalized = isGitInitalized;
const shouldStash = async (path) => {
    if (await isGitInitalized(path)) {
        return false;
    }
    const gitStatus = await (0, executeShellCmd_1.execShell)("git status");
    if (gitStatus.split("\n")[2].startsWith("nothing to commit")) {
        return false;
    }
    return true;
};
exports.shouldStash = shouldStash;
//# sourceMappingURL=gitOperations.js.map