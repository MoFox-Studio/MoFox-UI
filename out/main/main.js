"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const util = require("util");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const util__namespace = /* @__PURE__ */ _interopNamespaceDefault(util);
const execAsync = util__namespace.promisify(child_process.exec);
const CONFIG_PATH = path__namespace.join(electron.app.getPath("userData"), "config.json");
async function saveLastDirectory(directoryPath) {
  try {
    await fs__namespace.promises.writeFile(CONFIG_PATH, JSON.stringify({ lastDirectory: directoryPath }));
  } catch (error) {
    console.error("保存目录失败:", error);
    throw error;
  }
}
async function getLastDirectory() {
  try {
    if (await fs__namespace.promises.access(CONFIG_PATH).then(() => true).catch(() => false)) {
      const content = await fs__namespace.promises.readFile(CONFIG_PATH, "utf8");
      const config = JSON.parse(content);
      return config.lastDirectory || "";
    }
    return "";
  } catch (error) {
    console.error("读取目录失败:", error);
    return "";
  }
}
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path__namespace.join(__dirname, "preload.js")
    }
  });
  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path__namespace.join(electron.app.getAppPath(), "dist/index.html"));
  }
}
electron.app.whenReady().then(() => {
  electron.ipcMain.handle("open-directory-dialog", async () => {
    const filePaths = electron.dialog.showOpenDialogSync({
      properties: ["openDirectory", "createDirectory"]
    });
    return filePaths && filePaths.length > 0 ? filePaths[0] : "";
  });
  electron.ipcMain.handle("open-file-dialog", async () => {
    const filePaths = electron.dialog.showOpenDialogSync({
      properties: ["openFile"]
    });
    return filePaths && filePaths.length > 0 ? filePaths[0] : "";
  });
  electron.ipcMain.handle("save-last-directory", async (_, path2) => {
    await saveLastDirectory(path2);
  });
  electron.ipcMain.handle("get-last-directory", async () => {
    return await getLastDirectory();
  });
  async function getProcessUptime(processName, scriptName, directory) {
    const command = process.platform === "win32" ? `wmic process where "name like 'python%' and commandline like '%${scriptName.replace(/\\/g, "\\\\")}%'" get creationdate /format:list` : `ps -eo comm,etime,args | grep ${processName} | grep ${scriptName}`;
    try {
      const { stdout } = await execAsync(command, { cwd: directory });
      if (process.platform === "win32") {
        if (!stdout.trim()) return "未运行";
        const match = stdout.match(/CreationDate=(\d+)/);
        if (!match) return "解析失败";
        const startTimeStr = match[1];
        const year = parseInt(startTimeStr.substring(0, 4), 10);
        const month = parseInt(startTimeStr.substring(4, 6), 10) - 1;
        const day = parseInt(startTimeStr.substring(6, 8), 10);
        const hour = parseInt(startTimeStr.substring(8, 10), 10);
        const minute = parseInt(startTimeStr.substring(10, 12), 10);
        const second = parseInt(startTimeStr.substring(12, 14), 10);
        const startTime = new Date(year, month, day, hour, minute, second);
        const uptimeMs = Date.now() - startTime.getTime();
        const days = Math.floor(uptimeMs / (1e3 * 60 * 60 * 24));
        const hours = Math.floor(uptimeMs % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
        const minutes = Math.floor(uptimeMs % (1e3 * 60 * 60) / (1e3 * 60));
        return `${days}天 ${hours}小时 ${minutes}分钟`;
      } else {
        const lines = stdout.trim().split("\n");
        if (lines.length === 0) return "未运行";
        const processLine = lines.find((line) => line.includes(scriptName));
        if (!processLine) return "未找到脚本";
        const parts = processLine.trim().split(/\s+/);
        const etime = parts[1];
        return etime || "解析失败";
      }
    } catch (error) {
      console.error("获取进程运行时间失败:", error);
      return "错误";
    }
  }
  electron.ipcMain.handle("get-process-uptime", async (_, processName, scriptName, directory) => {
    return await getProcessUptime(processName, scriptName, directory);
  });
  electron.ipcMain.handle("restart-webui", () => {
    electron.app.relaunch();
    electron.app.quit();
  });
  electron.ipcMain.handle("restart-mofox-bot", async (_, botDirectoryPath) => {
    const scriptPath = path__namespace.join(botDirectoryPath, "bot", "src", "main.py");
    const scriptDir = path__namespace.dirname(scriptPath);
    const isWindows = process.platform === "win32";
    const commandLineIdentifier = scriptPath.replace(/\\/g, "\\\\");
    const killCommand = isWindows ? `wmic process where "name like 'python%' and commandline like '%${commandLineIdentifier}%'" delete` : `pkill -f "${scriptPath}"`;
    const checkCommand = isWindows ? `wmic process where "name like 'python%' and commandline like '%${commandLineIdentifier}%'" get processid` : `pgrep -f "${scriptPath}"`;
    const startCommand = `python main.py`;
    const executeAndLog = async (cmd, options = {}) => {
      try {
        console.log(`Executing: ${cmd}`);
        const { stdout, stderr } = await execAsync(cmd, options);
        if (stdout) console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
        return { stdout, stderr };
      } catch (error) {
        console.error(`Error executing command: ${cmd}`, error);
        throw error;
      }
    };
    try {
      console.log("Attempting to kill MoFox-bot...");
      await executeAndLog(killCommand);
      console.log("Kill command executed.");
    } catch (error) {
      console.log("Bot was likely not running. Continuing...");
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const { stdout } = await executeAndLog(checkCommand);
      if (stdout && stdout.trim() !== "") {
        console.log("Bot still running, killing again...");
        await executeAndLog(killCommand);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (e) {
    }
    try {
      console.log("Starting MoFox-bot...");
      executeAndLog(startCommand, { cwd: scriptDir });
      console.log("Bot start command issued.");
      return { success: true, message: "机器人重启成功。" };
    } catch (error) {
      console.error("Failed to start the bot:", error);
      return { success: false, message: `启动机器人失败: ${error.message}` };
    }
  });
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
