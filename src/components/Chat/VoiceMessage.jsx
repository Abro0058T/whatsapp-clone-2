import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import React, { useEffect, useRef, useState } from "react";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import WaveSurfer from "wavesurfer.js";

function VoiceMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  const [audioMessage, setAudioMesage] = useState(null);
  const [isPlaying, setisPlaying] = useState(false);

  const [currentPlaybackTime, setcurrentPlaybackTime] = useState(0);
  const [totalDuration, settotalDuration] = useState(0);

  const waveFormRef = useRef(null);
  const waveform = useRef(null);
  const handlePlayAudio = () => {
    if (audioMessage) {
      waveform.current.stop();
      waveform.current.play();
      audioMessage.play();
      setisPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    waveform.current.stop();
    audioMessage.pause();
    setisPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (audioMessage) {
      const updatePlaybackTime = () => {
        setcurrentPlaybackTime(audioMessage.currentTime);
      };
      audioMessage.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        audioMessage.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [audioMessage]);

  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = WaveSurfer.create({
        container: waveFormRef.current,
        waveColor: "#ccc",
        progressColor: "#333",
        barWidth: 2,
        height: 30,
        responsive: true,
      });
      waveform.current.on("finish", () => {
        setisPlaying(false);
      });
    }
    return () => {
      waveform.current.destroy();
    };
  }, [message.message]);

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setAudioMesage(audio);
    waveform.current?.load(audioURL);
    waveform.current.on("ready", () => {
      settotalDuration(waveform.current.getDuration());
    });
  }, [message.message]);

  return( <div  className={`flex flex-row items-center gap-5 text-white px-4 py-4 text-sm rounded-md ${
    message.senderId === currentChatUser.id
      ? "bg-incoming-background"
      : "bg-outgoing-background"
  }`} >
    <div className="flex flex-row items-center">
      <Avatar type="lg" image={currentChatUser?.profilePicture}/>
      <div className="cursor-pointer text-xl">
        {
          !isPlaying ? <FaPlay onClick={handlePlayAudio}/> : <FaStop onClick={handlePauseAudio}/>
        }
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef}/>
        <div className="text-bubble-meta text=[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>{formatTime(isPlaying ? currentPlaybackTime :totalDuration)}</span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {
              message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus}/>
            }
          </div>
        </div>
      </div>
    </div>
  </div>)
}

export default VoiceMessage;

