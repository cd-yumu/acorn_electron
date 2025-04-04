import { ipcRenderer, contextBridge, ipcMain } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  screenCapture:()=>ipcRenderer.invoke("screen-capture"),
  onGetImage:(callback:()=>string)=>{

    // Control+s 를 눌렀을때 main 프로세스에서 발생할 이벤트에 귀을 귀울인다.  
    ipcRenderer.on("get-image", ()=>{
      //callback() 함수를 호출하면 App.tsx 가 가지고 있는 이미지 data 를 리턴받는다.
      const imageData = callback();
      //이벤트를 발생 시키면서 이미지 데이터를 main 프로세스에 전달한다.
      ipcRenderer.send("save-image", imageData);
    });
  },
  onCaptureStart:(callback: ()=>void) => {
    // main process 에서 "capture-start" 이벤트가 발생하면 
    ipcRenderer.on("capture-start", ()=>{
      // App.ts 에서 전달했던 함수를 호출해준다.
      callback();
    });
  },
  selectCapture:(area)=>{
    // main process 에 "select-capture" 이벤트 발생 시키면서 capture 할 영역을 전달한다.
    ipcRenderer.send("select-capture", area);
  },
  onCapturedData:(callback:(a:string)=>void)=>{
      ipcRenderer.on("captured-data", (_event, data)=>{
        callback(data);
      });
  }
})