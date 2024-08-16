import React, { useEffect, useRef, useState } from "react";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { userInfo } from "os";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { reducerCases } from "@/context/constants";
import Chat from "./Chat/Chat";
import { io } from "socket.io-client";
import { measureMemory } from "vm";
import SearchMessages from "./Chat/SearchMessages";

function Main() {
  const router = useRouter();
  const [{ userInfo,currentChatUser, messagesSearch }, dispatch] = useStateProvider();
  const [redirectLogin, setredirectLogin] = useState(false);
  const [socketEvent, setsocketEvent] = useState(false)
  const socket=useRef()

  useEffect(()=>{
    if(redirectLogin) router.push("/login")
  },[redirectLogin])


  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setredirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });
      if (!data?.status) {
        router.push("/login");
      }
      console.log(data?.data)
      if(data?.data){
        const { id, name, email, profilePicture: profileImage, status } = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          useInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          },
        });
      }
    }
    });
    
    useEffect(()=>{
      if(userInfo){
        socket.current = io(HOST);
        // console.log(userInfo,"user")
        socket.current.emit("add-user",userInfo.id);
        dispatch({type:reducerCases.SET_SOCKET,socket})
      }
    },[userInfo])

    useEffect(()=>{
      console.log(socketEvent,"socketEvent")
      if(socket.current && !socketEvent) {
        // console.log("Here in msg-recieve")
        socket.current.on("msg-recieve",(data) => {
          console.log(data,"Message recieved")
          dispatch({type:reducerCases.ADD_MESSAGES,newMessage:{...data.message}})
        })
        setsocketEvent(true)
      }
    },[socket.current])

    useEffect(()=>{

      const getMessages = async () => {
        const {data:{messages}} = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`)
        dispatch({type:reducerCases.SET_MESSAGES,messages})
      }
      if(currentChatUser?.id){
        getMessages()
      }
    },[currentChatUser])

    return (
      <>
      <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
        <ChatList />
        {
          currentChatUser ?  <div className={messagesSearch ? "grid grid-cols-2":"gird-cols-2"}>
            <Chat/> 
            {
              messagesSearch && <SearchMessages/>
            }
          </div>
          : <Empty/>
        }
      </div>
    </>
  );
}

export default Main;

//5:20: