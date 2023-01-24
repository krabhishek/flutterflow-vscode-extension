# FlutterFlow Code Export

Simple plugin to easily download your flutterflow project code.

**This is not an official FlutterFlow plugin**

## Features

Download code of your FlutterFlow Project

* Run code locally (no more waiting for test mode)
* Better control over code management (works even without github)

## Requirements

dart and flutter need to be installed and dart should be in $PATH. 

## Extension Settings

This extension contributes the following settings:

* `flutterflow.userApiToken`: Set the FlutterFlow API token.
* `flutterflow.activeProject`: Set the active project ID to sync.
* `flutterflow.workingDirectory`: Full path to a local folder that you want to use to download 

## Known Issues

Please raise issues at : https://github.com/krabhishek/flutterflow-vscode-extension/issues

## Release Notes

* Download flutterflow project code. Uses flutterflow_cli : https://pub.dev/packages/flutterflow_cli

### 0.0.3

Added support to download code without assets (can speedup code download for projects with lots of assets)
### 0.0.2

Initial release of FlutterFlow Code Export plugin

**Enjoy!**
