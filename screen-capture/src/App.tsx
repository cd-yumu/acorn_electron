import { useEffect, useRef, useState } from "react";

// capture 할 4 각형 영역정보를 담을 type 
interface Area{
  x: number;
  y: number;
  width: number;
  height: number;
}

declare global{
  interface Window{
    api:{
      screenCapture : ()=>Promise<string>,
      onGetImage: (a: ()=>string|undefined)=>void,
      onCaptureStart: (a: ()=>void)=>void,
      selectCapture: (a:Area)=>void,
      onCapturedData : (a:(imgageData:string)=>void)=>void
    }
  }
}

function App() {
  const [imageData, setImageData]=useState<string>(); 
  
  const imageDataRef = useRef<string>();

  useEffect(()=>{
    //이미지 데이터가 변경될때 마다 해당 값을 imageDataRef 에 새로 등록한다.
    imageDataRef.current=imageData;
  }, [imageData]);

  useEffect(()=>{
    window.api.onGetImage(()=>{
      // imageDataRef 객체를 참조하도록 리턴해준다. 
      return imageDataRef.current;
    });
    // main process 에서 captue start 이벤트가 발생했을때 실행할 함수 전달 
    window.api.onCaptureStart(()=>{
      setIsCaptureMode(true);
    });
    // main process 에서 'captured-data' 이벤트가 발생했을 때 실행할 함수 전달
    window.api.onCapturedData((data:string)=>{
      setImageData(data);
    });
  }, []);
  
  const handleCapture = async ()=>{
    //result 는 capture 된 이미지의 data url 문자열 
    const result = await window.api.screenCapture();
    setImageData(result);
  }
  //현재 capture 모드인지 여부 (현재 overlayWindow 가 활성화 되었는지 여부부)
  const [isCaptureMode, setIsCaptureMode] = useState(false);
 
  const canvasStyle={
    border:"1px dotted red",
    cursor:"crosshair",
    width:window.innerWidth,
    height:window.innerHeight
}
const canvasRef = useRef<HTMLCanvasElement>(null);

//현재 그리기 모드인지 여부
const [isDrawing, setIsDrawing] = useState(false);
//선택한 사각형 영역을 state 로 관리하기
const [state, setState]=useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
});

//마우스 다운 이벤트가 일어 났을때 
const handleMouseDown = (e: React.MouseEvent) => {
    //현재 그리고 있는 상태로 변경한다. 
    setIsDrawing(true);
    // canvas 내에서의 정확한 상태좌표를 얻어내기 위한 계산 
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    // state 에 해당 좌표를 저장한다. 
    setState({
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
   
  };

  const handleMouseMove = (e: React.MouseEvent) => {

    // mouse move 이벤트가 발생하더라도 현재 그리는 중이 아니면 함수를 여기서 종료!
    if (!isDrawing) return;

    // 현재 마우스의 좌표 얻어내기 
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;
    // 현재 state 에서 출발점의 좌표를 얻어낸다.
    const { startX, startY } = state;
    
    // 출발점의 좌표와 현재 좌표를 비교해서 더 작은 값을 얻어낸다.
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    //현재 좌표와 시작점 사이의 거리를 얻어낸다.
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    // canvas 에 그림을 그릴 도구의 참조값 얻어와서 
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {

      // 1. 전체 캔버스를 반투명한 어두운 색으로 덮는다.
      ctx.clearRect(0,0,canvasRef.current!.width, canvasRef.current!.height);
      ctx.fillStyle = 'rgb(0,0,0,0.2)';
      ctx.fillRect(0,0,canvasRef.current!.width, canvasRef.current!.height);

      // 2. 선택한 사각형 영역만 clear 해서 완전 투명하게 만든다.
      ctx.clearRect(x,y,width, height);

      // 3. 선택 영역 외곽선 그리기
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x,y,width, height);



      //  .clearRect(x, y, width, height)  사각형 영역에 그려진 내용을 모두 지우기 
      ctx.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
      // 체우는 색상 
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      // 체우는 스타일의 사각형 그리기 
      ctx.fillRect(x, y, width, height);
      // 외곽선 색상
      ctx.strokeStyle = 'red';
      // 선의 굵기
      ctx.lineWidth = 2;
      // 외곽선 그리기 
      ctx.strokeRect(x, y, width, height);
    }
    // 사각형을 그린후 현재 좌표를 state 에 저장한다. 
    setState((prev) => ({
      ...prev,
      endX: currentX,
      endY: currentY,
    }));
    
  };

  const handleMouseUp = async () => {
    //마우스를 떼었을때 다시 상태값을 변경해준다. 
    setIsDrawing(false);
    setIsCaptureMode(false);
    const area:Area = {
      x: Math.min(state.startX, state.endX),
      y: Math.min(state.startY, state.endY),
      width: Math.abs(state.endX - state.startX),
      height: Math.abs(state.endY - state.startY),
    }
    window.api.selectCapture(area);
  };

  return (
    <div>
      {isCaptureMode ?
        <canvas style={canvasStyle}
          width={canvasStyle.width} 
          height={canvasStyle.height}
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}/>
        :
        <>
          <h1>화면 캡쳐 예제</h1>
          <button onClick={handleCapture}>화면캡쳐</button>
          <br/>
          { imageData && <img src={imageData}/>}
        </>
      }
    </div>
  )
}

export default App