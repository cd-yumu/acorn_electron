import { useRef } from "react"
// bootstrap css 로딩딩
import 'bootstrap/dist/css/bootstrap.css'


declare global{
  interface Window{
    api:{
      save:(content:string)=>void;
    }
  }
}

function App() {

  const areaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      <h1>메모장 입니다</h1>
      <textarea ref={areaRef} className="form-control" style={{height:"300px"}}></textarea>
      <button className="btn btn-success" onClick={()=>{
        // 입력한 문자열
        const content = areaRef.current?.value;
        window.api.save(content || "");
        alert("저장했습니다.");
      }}>저장</button>
      <button className="btn btn-primary">불러오기</button>
    </div>
  )
}

export default App
