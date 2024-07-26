import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./ContactsContainer";
import ChatContainer from "./ChatContainer";
import EmptyChatContainer from "./EmptyChatContainer";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();

  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo?.profileSetup) {
      toast("Please complete your profile setup to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-screen text-white overflow-hidden">
      {isUploading && (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-lg gap-5">
          <h5 className="text-5xl animate-pulse">Uploading File</h5>
          <p className="text-3xl">{fileUploadProgress}%</p>
        </div>
      )}
      {isDownloading && (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-lg gap-5">
          <h5 className="text-5xl animate-pulse">Downloading File</h5>
          <p className="text-3xl">{fileDownloadProgress}%</p>
        </div>
      )}
      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;
