import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FcCompactCamera } from "react-icons/fc";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState();
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCordinates, setcontextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  const [showPhotoLibrary, setshowPhotoLibrary] = useState(false)
  const [grabPhoto,setGrabPhoto]=useState(false)
  const [showCapturePhoto, setshowCapturePhoto] = useState(false)

  useEffect(()=>{
    if(grabPhoto){
      const data=document.getElementById("photo-picker")
      data.click()
      document.body.onfocus=(e)=>{
        setTimeout(()=>{

          setGrabPhoto(false)
        },1000)
      }
    }
  },[grabPhoto])


  const contextMenuOptions=[
    {name:"Take Photo",callBack:()=>{{
      setshowCapturePhoto(true)
    }}},
    {name:"Choose From Library",callBack:()=>{{
      setshowPhotoLibrary(true)
    }}},
    {name:"Upload Photo",callBack:()=>{
      setGrabPhoto(true)
    }},
    {name:"Remove Photo",callBack:()=>{
      setImage("/default_avatar.png")
    }}
  ]

  const showContextMenu = (e) => {
    e.preventDefault();
    setcontextMenuCordinates({
      x: e.pageX,
      y: e.pageY,
    });
    setIsContextMenuVisible(true);
  };

  const photoPickerChange=async (e )=> {
    const  file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img")
    reader.onload=function(event){
      data.src=event.target.result;
      data.setAttribute("data-src",event.target.result);
    }
    reader.readAsDataURL(file);
    setTimeout(()=>{
      setImage(data.src);
    },100)
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" className="rounded-full" fill />
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              onClick={(e) => showContextMenu(e)}
                    id="context-opener"
            >
              <FcCompactCamera
                className="text-2xl "
                id="context-opener"
                
                onClick={(e) => showContextMenu(e)}
              />
              <span
               
               onClick={(e) => showContextMenu(e)}
                     id="context-opener"
               >
                Change <br /> profile <br />
                photo
              </span>
            </div>
            <div className="flex justify-center h-60 w-60 ">
              <Image src={image} alt="avatar" className="rounded-full" fill />
            </div>
          </div>
        )}
      </div>
      {
        isContextMenuVisible && <ContextMenu
        options={contextMenuOptions}
        cordinates={contextMenuCordinates}
        contextMenu={isContextMenuVisible}
        setContestMenu={setIsContextMenuVisible}
        />
      }
      {
        showCapturePhoto && <CapturePhoto  
        setImage={setImage} hide={setshowCapturePhoto}/>
      }
      {
        showPhotoLibrary && <PhotoLibrary setImage={setImage} 
        hidePhotoLibrary={setshowPhotoLibrary}
        />
      }
      {
        grabPhoto&& <PhotoPicker onChange={photoPickerChange}/>
      }
    </div>
  );
}

export default Avatar;



// 5:34:52