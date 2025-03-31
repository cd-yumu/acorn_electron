"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  save: (content) => {
    electron.ipcRenderer.send("saveMemo", content);
  }
});
