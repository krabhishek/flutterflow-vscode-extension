# FlutterFlow Code Export

Simple plugin to easily download your flutterflow project code.

**This is not an official FlutterFlow plugin**

## Features

Download code of your FlutterFlow Project

- Run code locally (no more waiting for test mode)
- Better control over code management (works even without github)

More details are [here](https://community.flutterflow.io/c/show-your-work/vs-code-plugin-for-flutterflow-code-download)

## Requirements

dart and flutter need to be installed and dart should be in $PATH.

## Extension Settings

This extension contributes the following settings:

- `flutterflow.userApiToken`: Set the FlutterFlow API token
- `flutterflow.userApiTokenIndia`: Set the FlutterFlow API token if you're using Enterprise India
- `flutterflow.platformEnterpriseIndia`: Check this if you're using Enterprise India
- `flutterflow.activeProject`: Set the active project ID to sync
- `flutterflow.baseDirectory`: Full path to a local folder that you want to use to download project code
- `flutterflow.useGit`: Flag to enable local git repo
- `flutterflow.openDirectory`: Flag to automatically open downloaded code in a window
- `flutterflow.device`: Device ID to be used with flutter run -d

## Known Issues

Please raise issues at : https://github.com/krabhishek/flutterflow-vscode-extension/issues

## Release Notes

- Download flutterflow project code. Uses flutterflow_cli : https://pub.dev/packages/flutterflow_cli

### 0.0.8

Added support for Enterprise India

### 0.0.7

Fixed a bug with recursive folder

### 0.0.4

Added support for windows devices and use local git repo
Also added shortcut to start a local debugging session

### 0.0.3

Added support to download code without assets (can speedup code download for projects with lots of assets)

### 0.0.2

Initial release of FlutterFlow Code Export plugin

**Enjoy!**
