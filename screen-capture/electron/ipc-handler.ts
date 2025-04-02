// electron/ipc-handler.ts

import { desktopCapturer, ipcMain, screen } from "electron";

ipcMain.handle("screen-capture", async ()=>{
    // Display 객체 얻어내기
    const display = screen.getPrimaryDisplay();
    // 화면의 크기 정보
    const {bounds} = display;
    // 원하는 크기로 capture 하기
    const sources = await desktopCapturer.getSources({
        types:["screen"],
        thumbnailSize:{width:bounds.width, height:bounds.height}
    });
    if(sources.length>0){
        const screen = sources[0];
        const thumbnail = screen.thumbnail;
        // 캡쳐된 이미지 객체를 data url 문자열로 얻어내서 리턴한다.
        const dataUrl = thumbnail.toDataURL();
        return dataUrl; // 여기서 리턴된 것을 <img url=" 이곳에 "> 넣어줄 예정정
    }
    throw new Error("Error!!");
});