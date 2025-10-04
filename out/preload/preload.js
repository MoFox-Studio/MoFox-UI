"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  openDirectoryDialog: () => electron.ipcRenderer.invoke("open-directory-dialog"),
  openFileDialog: () => electron.ipcRenderer.invoke("open-file-dialog"),
  saveLastDirectory: (path) => electron.ipcRenderer.invoke("save-last-directory", path),
  getLastDirectory: () => electron.ipcRenderer.invoke("get-last-directory"),
  getProcessUptime: (processName, scriptName, directory) => electron.ipcRenderer.invoke("get-process-uptime", processName, scriptName, directory),
  restartWebUI: () => electron.ipcRenderer.invoke("restart-webui"),
  restartMofoxBot: (botDirectoryPath) => electron.ipcRenderer.invoke("restart-mofox-bot", botDirectoryPath)
});
