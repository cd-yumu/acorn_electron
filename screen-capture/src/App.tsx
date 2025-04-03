import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    api: {
      screenCapture: () => Promise<string>
      onGetImage: (a:()=>string|undefined)=>void
    }
  }
}

function App() {

  const[imageData, setImageData] = useState<string>();
  const imageDataRef = useRef<string>();
  
  useEffect(()=>{
    // 이미지 데이터가 변경 될 때 마다 값을 imageDataRef 에 새로 등록한다.
    imageDataRef.current = imageData;
  },[imageData])

  useEffect(()=>{
    window.api.onGetImage(()=>{
      // imageDataRef 객체를 참조하도록 리턴해준다.
      return imageDataRef.current;  // 값이 아닌 참조값을 리턴하는 함수
    });
  },[]);
  
  const handleCapture = async () => {
    // result  는 capture 된 이미지의 data url 문자열
    const result = await window.api.screenCapture();
    console.log(result);
    setImageData(result);
  }

  
  
  return (
    <div>
      <h1>화면 캡쳐 예제</h1>
      <button onClick={handleCapture}>화면캡쳐</button>
      { imageData && <img src={imageData} />}
    </div>
  )
}

export default App
