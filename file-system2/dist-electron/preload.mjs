"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  /*
      in App.tsx 에서
      window.api.save() 함수를 호출하는 것은
      여기를 호출하는 것과 같다.
  
      App.tsx 와 preload.tx 의 관계 숙지!
    */
  save: (content) => {
    console.log("save!");
    electron.ipcRenderer.send("saveMemo", content);
  },
  load: () => {
    electron.ipcRenderer.send("loadMemo");
  },
  onLoad: (callback) => {
    electron.ipcRenderer.on("loaded", (_event, content) => {
      callback(content);
    });
  },
  load2: () => {
    return electron.ipcRenderer.invoke("loadMemo2");
  },
  load3: () => electron.ipcRenderer.invoke("loadMemo3"),
  onSave: (callback) => {
    electron.ipcRenderer.on("saveContent", (_event, data) => {
      const content = callback();
      console.log("현재까지 입력한 문자열: " + content);
      data.content = content;
      electron.ipcRenderer.send("saveContent", data);
    });
  }
});
