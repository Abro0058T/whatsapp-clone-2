import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

function login() {
  const  router=useRouter()
  const [{userInfo,newUser},dispatch]=useStateProvider()

  useEffect(()=>{
    if(userInfo?.id && !newUser) router.push("/")
  },[userInfo,newUser])

  const handleLogin=async ()=>{
    const provider=new GoogleAuthProvider()
    const {user:{displayName:name,email,photoURL:profileImage}}=await signInWithPopup(firebaseAuth,provider)
    console.log(name)
    try{
      if(email){
        console.log("here")
        const {data}=await axios.post("http://localhost:3005/api/auth/check-user",{email});
        
        if(!data.status){
          dispatch({type:reducerCases.SET_NEW_USER,newUser:true})
          dispatch({
            type: reducerCases.SET_USER_INFO,useInfo:{
              name, email,profileImage,status:""
            }
          })
          router.push("/onboarding")
        }else {
          const {id,name,email,profilePicture:profileImage,status}=data.data;
          dispatch({
            type: reducerCases.SET_USER_INFO,useInfo:{
            id,name,email,profileImage,status
            }
          })
          router.push("/")
        }
      }
    }catch(error){
      console.log("here")
      console.log(error,"error")
    }
  }
  return <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
    <div className="flex items-center justify-center gap-2">
      <Image
      src="/whatsapp.gif" alt="whatsapp" height={300} width={300}/>
      <span className="text-7xl text-white">
        Whatsapp
      </span>
    </div>
    <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg " onClick={handleLogin}>
      <FcGoogle className="text-4xl"/>
      <span className="text-white text-xl">Login with google</span>
    </button>
  </div>;
}

export default login;
