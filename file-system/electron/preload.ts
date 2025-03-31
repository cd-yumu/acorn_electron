import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {

  

  save:(content:string)=>{
    // 매개변수에 전달된 문자열을 ememo 파일에 저장하기
    ipcRenderer.send("saveMemo", content);
  }


})
