import { useState } from "react";

declare global{
  interface Window{
    api:{
      screenCapture :()=>Promise<string>
    }
  }
}



function App() {

  const handleCapture = async ()=>{
    const result = await window.api.screenCapture();  //dataUrl
    console.log(result);
    setImageData(result);
  }
  
  const [imageData, setImageData] = useState<string>();

  return (
    <div>
      <h1>화면 캡쳐 예제</h1>
      <button onClick={handleCapture}>화면 캡쳐</button>
      { imageData && <img src={imageData}/>}
      <img/>
    </div>
  )
}

export default App
