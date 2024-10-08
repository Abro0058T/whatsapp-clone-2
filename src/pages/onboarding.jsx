import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { ONBOARD_USER } from "@/utils/ApiRoutes";
import { useRouter } from "next/router";
import axios from "axios";
import { reducerCases } from "@/context/constants";
function onboarding() {
  const router=useRouter()
  const [{userInfo,newUser},dispatch]=useStateProvider()
  const [name,setName]=useState(userInfo?.name || "")
  const [about,setAbout]=useState("");
  const [image,setImage]=useState("/default_avatar.png")

  useEffect(()=>{
    if(!newUser && !userInfo?.email){
      router.push("/login")
    }
    else if( !newUser && userInfo?.email){
      router.push("/")
    }
    
  },[newUser,userInfo,router])

  const onBoardUserHandler = async () => {
    if(validateDetails()){
      const email=userInfo.email;
      try{
        const {data}=await axios.post(ONBOARD_USER,{
          email,
          name,
          about,
          image
        })
        if(data.status){
          dispatch({type:reducerCases.SET_NEW_USER,newUser:false})
          dispatch({
            type: reducerCases.SET_USER_INFO,useInfo:{
              id:data.user.id,
              name, email,image,status:about,
            }
          })
          router.push("/")
        }
      }catch(err){
        console.log(err)
      }
    }
  }
  const validateDetails =() =>{
    if(name.length<3){
      return false
    }
    return true
  }
  return <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center ">
    <div className="flex items-center justify-center gap-2">
      <Image
      src="/whatsapp.gif" alt="whatsapp " height={300} width={300}/>
      <span className="text-7xl">Whatsapp</span>
    </div>
    <h2 className="text-2xl">Create your profile</h2>
    <div className="flex m-6 gap-6">
      <div className="flex flex-col items-center justify-center mt-5  gap-6 ">
        <Input name="Display Name" state={name} setState={setName} lable />
        <Input name="About" state={about} setState={setAbout} lable/>
        <div className="flex items-center justify-center">
          <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg " 
          onClick={onBoardUserHandler}
          >
            Create Profile 
          </button>
        </div>
      </div>
      <div>
        <Avatar type="xl" image={image} setImage={setImage}/>
      </div>
    </div>
  </div>;
}

export default onboarding;
