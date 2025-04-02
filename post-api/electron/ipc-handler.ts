// electron/ipc-handler.ts
// main.ts 에서 이 파일을 import 해야 동작이 준비된다.
// 이 파일은 main.ts 와 관련이 없는 상태. 따라서 main.ts 에서 import 가 필요


import { ipcMain } from "electron";
import { Post } from "./types";
import api from "./api";

// renderer 에서 "get-posts" 를 invoke 하면 실행할 함수 등록
ipcMain.handle("get-posts", async()=>{
    const response = await api.get<Post[]>("/v1/posts");
    // 여기서 리턴해주는 response.data 는 Post[] type 이다.
    return response.data;
});

ipcMain.handle("add-post", async(_event, newPost)=>{
    console.log(_event); // 첫번째 인자로 event 객체가 전달된다.
    const response = await api.post<Post>("/v1/posts", newPost);
    return response.data;
});

ipcMain.handle("delete-post", async(_event, id)=>{
    const response = await api.delete(`/v1/posts/${id}`);
    return response.data;
});

ipcMain.handle("update-post", async(_event, post)=>{
    const response = await api.put<Post>(`/v1/posts/${post.id}`,post);
    return response.data;
}); 