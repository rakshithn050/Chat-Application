import React from "react";
import MessageContainer from "./MessageContainer";
import MessageBar from "./MessageBar";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-[100vh] w-[100vw] bg-gray-900 flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
