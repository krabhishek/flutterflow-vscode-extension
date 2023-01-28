"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flutterPubGet = exports.flutterBuildRunner = exports.deviceList = void 0;
const shell = require("shelljs");
const deviceList = () => {
    const devices = [];
    shell.config.execPath = shell.which("node");
    const devicesList = JSON.parse(shell.exec("flutter devices --machine", { silent: true }).stdout);
    console.log(devicesList);
    if (devicesList.length == 0) {
        return [{ deviceId: undefined, deviceName: undefined }];
    }
    devicesList.forEach((device) => {
        devices.push({ deviceId: device["id"], deviceName: device["name"] });
    });
    return devices;
};
exports.deviceList = deviceList;
const flutterPubGet = (workingDir) => {
    try {
        shell.config.execPath = shell.which("node");
        shell.cd(workingDir);
        shell.exec(`flutter pub get`);
    }
    catch (err) {
        throw err;
    }
};
exports.flutterPubGet = flutterPubGet;
const flutterBuildRunner = (workingDir) => {
    try {
        shell.config.execPath = shell.which("node");
        shell.cd(workingDir);
        shell.exec(`flutter packages pub run build_runner build --delete-conflicting-outputs`);
    }
    catch (err) {
        throw err;
    }
};
exports.flutterBuildRunner = flutterBuildRunner;
//# sourceMappingURL=flutterRunOperations.js.map