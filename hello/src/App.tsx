import { useEffect, useState } from 'react';
import './App.css'

// window. 해서 사용할 수 있는 전역 객체 선언
declare global{
  interface Window{
    electronAPI:{
      onMessage:(callback:(msg:string)=>void)=>void
    }
  }
}

function App() {
  // electron 으로 부터 도착한 메시지를 상태값으로 관리하기
  const [msg, setMsg] = useState("");

  useEffect(()=>{
    // electron 으로 부터 메시지가 도착하면 실행할 함수 등록
    window.electronAPI.onMessage((m:string)=>{
      // 매개 변수에 전달된 문자열로 상태값 변경
      setMsg(m);
    })
  },[]);

  return (
    <>
      <h1>Hello Elctron!</h1>
      <p>Message: <strong>{msg}</strong></p>
    </>
  )
}

export default App
