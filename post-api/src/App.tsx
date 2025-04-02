import { ChangeEvent, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import EditPostModal from "./components/EditPostModal";
import ToastMessage from "./components/ToastMessage";
import { ToastInfo } from "./types";

interface Post{
  readonly id?:number;
  title:string;
  author:string;
}

// 아래 declare 는 TypeScript 지원을 위해 작성한 것으로 없다고 동작하지 않는 것은 아니다.
declare global{
  interface Window{
    api:{
      getPosts:()=>Promise<Post[]>                      // 글 목록을 받아오는 기능
      addPost:(a:Post)=>Promise<Post>                   // 글 추가 하는 기능
      deletePost: (a:number|undefined)=>Promise<Post>   // 글 삭제 하는 기능
      updatePost: (a:Post) => Promise<Post>             // 글 수정하는 기능
    }
  }
}

function App() {

  // 글 목록
  const [posts, setPosts] = useState<Post[]>([]);
  // 입력한 내용을 상태값으로 관리
  const [newPost, setNewPost] = useState<Post>({
    title:"",
    author:""
  });

  const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
    setNewPost({
      ...newPost,
      [e.target.name]:e.target.value
    });
  }

  // 글 목록을 받아오는 함수
  const load = async ()=>{
    // getPosts() 는 Promise 를 리턴해주기 때문에 await 를 할 수가 있고,
    // Promise 의 generic 이 Post[] 이기 때문에 리턴 type 이 Post[] 이다.
    const posts:Post[] = await window.api.getPosts();
    console.log(posts);
    setPosts(posts);
  }


  useEffect(()=>{
    // 글 목록을 받아와서 state 에 반영한다.
    load();
  },[])

  const add = async ()=>{
    try{ // wait 을 사용했기 때문에 try-catch 로 처리한다. / then 을 사용한다면  catch 로 처리 가능
      const post:Post = await window.api.addPost(newPost);
      console.log(post);
      // 입력창 초기화
      setNewPost({
        title:"",
        author:""
      });
      // 리프레쉬
      load();
      // Toast 띄우기
      setToastInfo({
        color:"success",
        message:"✅ 글을 작성했습니다.🥰 "
      })
      setShowToast(true);
    } catch(e){
      console.log(e);
      // Toast 띄우기
      setToastInfo({
        color:"warning",
        message:"❌ 글 저장에 실패했습니다.😱"
      })
      setShowToast(true);
    }
  }

  const deletePost = async (id:number|undefined)=>{
    await window.api.deletePost(id);
    // 리프레쉬
    load();
    // Toast 띄우기
    setToastInfo({
      color:"success",
      message:"글을 삭제했습니다."
    })
    setShowToast(true);
  };

  const [editPost, setEditPost] = useState({
    show:false,
    post:null
  });

  // 수정 버튼을 눌렀을 때 실행할 함수
  const handleUpdate = (item:Post)=>{
    setEditPost({show:true, post:item})
  }

  const [toast, setToast] = useState({
    show:false,
    color:"",
    message:""
  });


  /*
    유니코드 이모지(emoji)
    ✅😝 ❌😢 ⚠️ 
  */

  // Toast 메시지를 띄울지 여부를 상태값으로 관리
  const [showToast, setShowToast] = useState(false);

  // Toast 메시지의 색상과 내용을 상태값으로 관리
  const [toastInfo, setToastInfo] = useState<ToastInfo>({
    color:"",
    message:""
  });

  return (
    <div className="container">
      <ToastMessage 
        show={showToast} 
        info={toastInfo} 
        onClose={()=>{
          setShowToast(false);
        }}/>
      <EditPostModal 
        show={editPost.show} 
        post={editPost.post}
        onClose={()=>setEditPost({...editPost, show:false})} 
        onUpdate={async(post:Post)=>{
          const updatePost = await window.api.updatePost(post);
          console.log(updatePost);
          load();
          // Toast 띄우기
          setToastInfo({
            color:"success",
            message:"글을 수정했습니다."
          })
          setShowToast(true);
        }}/>
      <h1>게시글 (Spring Boot + Electron)</h1>
      <input type="text" placeholder="제목" name="title" onChange={handleChange} value={newPost.title}/>
      <input type="text" placeholder="작성자" name="author" onChange={handleChange} value={newPost.author}/>
      <button onClick={add}>추가</button>
      <table className="table table-striped">
        <thead className="table-dark"> 
          <tr>
            <th>아이디</th>
            <th>제목</th>
            <th>작성자</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          { posts.map(item=>(
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td><button onClick={()=>handleUpdate(item)}>수정</button></td>
              <td><button onClick={()=>deletePost(item.id)}>X</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
