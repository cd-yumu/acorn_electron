// src/App2.tsx

import { useEffect, useRef, useState } from "react";

function App2(props) {
  const canvasStyle = {
    border: "1px solid red",
    cursor: "crosshair",
    width: window.innerWidth,
    height: window.innerHeight
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 현재 그리기 모드인지 여부
  const [isDrawing, setIsDrawing] = useState(false);
  // 선택한 사각형 영역을 state 로 관리하기
  const [state, setState] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  });


  // 마우스 다운 이벤트가 일어 났을때 
  const handleMouseDown = (e: React.MouseEvent) => {
    // 현재 그리고 있있는 상태로 변경한다. 
    setIsDrawing(true);
    // canvas 내에서 정확한 상태좌표를 얻어내기 위한 계산
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

    // 현재 좌표와 시작점 사이의 거리를 얻어낸다.
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    // canvas 에 그림을 그릴 도구의 참조값 얻어와서
    const ctx = canvasRef.current?.getContext("2d");

    if (ctx) {
      // .clearRect(x,y,width,heigh) 사각형 영역에 그려진 내용을 모두 지우기기
      ctx.clearRect(0, 0, canvasStyle.width, canvasStyle.height);
      // 채우는 색상
      ctx.fillStyle = 'rgba(255, 255, 255, 0)';
      // 채우는 스타일의 사각형 그리기
      ctx.fillRect(x, y, width, height);
      // 외곽선 색상 
      ctx.strokeStyle = 'red';
      // 선의 굵기
      ctx.lineWidth = 2;
      // 외곽선 그리기 
      ctx.strokeRect(x, y, width, height);
    }

    // 사각형을 그린 후에 현재 좌표를 state 에 저장한다.
    setState((prev) => ({
      ...prev,
      endX: currentX,
      endY: currentY,
    }));
  };


  const handleMouseUp = async () => {
    // 마우스를 떼었을 때 다시 상태값을 변경해준다. 
    setIsDrawing(false);
  };

  return (
    <div>
      <canvas style={canvasStyle}
        width={canvasStyle.width}
        height={canvasStyle.height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>
      </canvas>
    </div>
  );
}
export default App2;