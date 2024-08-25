import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import {BsFillChatLeftTextFill,BsThreeDotsVertical} from 'react-icons/bs';
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
import { useRouter } from "next/router";

function ChatListHeader() {
  const [{userInfo},dispatch]=useStateProvider()
  const router= useRouter()
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x:0,
    y:0
  });
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({x:e.pageX - 50, y:e.pageY +20});
    setIsContextMenuVisible(true);
  }

  const contextMenuOption = [
    {
      name: "Logout",
      callBack: async () =>{
        // dispatch({type:reducerCases.SET_EXIT_CHAT})
        setIsContextMenuVisible(false)
        router.push("/logout")
      }
    }
  ]




  const handleAllContactsPage = () => {
    dispatch({type: reducerCases.SET_ALL_CONTACTS_PAGE})
  }

  return <div className="h-16 px-4 py-3 flex justify-center items-center">
    <div className="cursor-pointer">
      <Avatar type="sm" image={userInfo?.profileImage}/>
    </div>
    <div className="flex gap-6">
      <BsFillChatLeftTextFill 
      className="text-panel-header-icon  cursor-pointer text-xl"
      title="New chat"
      onClick={handleAllContactsPage}
      />
      <>
      <BsThreeDotsVertical 
      onClick={(e)=> showContextMenu(e)}
      className="text-panel-header-icon  cursor-pointer text-xl"
      id="context-opener"
      titel="Menu"/>
      </>
      {
        isContextMenuVisible && (
          <ContextMenu
          options={contextMenuOption}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContestMenu={setIsContextMenuVisible}
          />
        )
      }
    </div>
  </div>;
}

export default ChatListHeader;
