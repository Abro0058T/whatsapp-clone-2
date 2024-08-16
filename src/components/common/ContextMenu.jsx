import React, { useEffect, useRef } from "react";

function ContextMenu({options, cordinates ,contextMenu, setContestMenu}) {
  const contextMenuRef= useRef(null)

  useEffect(()=>{
    const handleOutSIdeClick=(event)=>{
      if(event.target.id !== "context-opener"){
        if(contextMenuRef.current && !contextMenuRef.current.contains(event.target)){
          setContestMenu(false)
        }
      }
    };
    document.addEventListener("click",handleOutSIdeClick)
    return ()=>{
      document.removeEventListener("click",handleOutSIdeClick)}
  },[])

  const handleClick =(e,callBack)=>{
    e.stopPropagation();
    setContestMenu(false);
    callBack();
  }
  return <div className={`bg-dropdown-background fixed py-2 z-[100]  shadow-xl`} ref={
    contextMenuRef}
    style={{
      top:`${cordinates.y}px`,
      left:`${cordinates.x}px`,
      display:contextMenu?"block":"none"
    }}
    >
      <ul>
        {
          options.map(({name,callBack})=>(
          <li key={name} onClick={(e)=>handleClick(e,callBack)}
          className="px-5 py-2 cursor-pointer hover:bg-background-default-hover">
            <span className="text-white">{name}</span>
          </li>)
        )
        }
      </ul>
    </div>;
}

export default ContextMenu;
