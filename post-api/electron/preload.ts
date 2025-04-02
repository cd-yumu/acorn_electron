import { ipcRenderer, contextBridge } from 'electron'
import { Post } from './types'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('api', {
  // main process 에 get-posts 요청을 한다다
  getPosts:()=>ipcRenderer.invoke("get-posts"),
  // handle 에서 받은 await 함수가 리턴되면서 Promise 가 해결되고 그게 then 으로 받아진 결과가 리턴된다?
  
  // main process 에 add-post 요청을 하면서 매개 변수에 전달된 추가 글정보를 전달한다.
  addPost:(newPost:Post)=>ipcRenderer.invoke("add-post", newPost),
  // invoke 는 정보를 요청하고 그 결과를 promise 로 받아오기 위해 사용한다.

  deletePost:(id:number)=>ipcRenderer.invoke("delete-post", id),

  updatePost:(post:Post)=>ipcRenderer.invoke("update-post", post)
})
/* 
  Renderer Process 에서 Main Process 에게 어떤 Event 를 발생시키기 위해서
  .invoke => .handle
  .on => 
*/