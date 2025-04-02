import { ipcRenderer, contextBridge } from 'electron'

// renderer 프로세스
contextBridge.exposeInMainWorld('api', {
    /*
    in App.tsx 에서
    window.api.save() 함수를 호출하는 것은
    여기를 호출하는 것과 같다.

    App.tsx 와 preload.tx 의 관계 숙지!
  */
  save: (content:string)=>{
    console.log("save!"); // 윈도우 앱(크로미움) 콘솔 창에 출력 - Renderer 프로세스 이기 때문에
    // main.ts 프로세스에 이밴트를 발생시키면서 저장할 문자열을 전달한다.
    ipcRenderer.send("saveMemo", content);
  },
  load: ()=>{
    ipcRenderer.send("loadMemo"); // main procecer 에서는 loadMemo 이벤트가 발생한다.
  },
  onLoad: (callback: (a:string)=>void)=>{
    // 이 이벤트는 여기에 실행의 흐름이 와야 등록이 된다.
    ipcRenderer.on("loaded", (_event, content)=>{
      callback(content);
    });
  },
  load2: ()=>{
    return ipcRenderer.invoke("loadMemo2");(
    // 이벤트를 발생시키는 invoke 의 리턴타입은 Promise 이다. (작업을 하고 결과 데이터를 바로 받을 수 있다.)
    // ipcMain 에서는 이 invoke 를 handle 로 받는다.
  },
  load3: ()=>ipcRenderer.invoke("loadMemo3"),
  onSave: (callback:()=>string)=>{
    ipcRenderer.on("saveContent",(_event, data)=>{
      // 현재까지 입력한 문자열 읽어오기
      const content = callback();
      // 콘솔에 출력하기
      console.log("현재까지 입력한 문자열: " + content);
      data.content=content;
      // main 프로세스에 이벤트 발생 시키면서 전달하기
      ipcRenderer.send("saveContent", data);
    });
  }
})
