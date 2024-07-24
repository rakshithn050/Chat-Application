import { useAppStore } from "@/store";
import moment from "moment";
import React, { useEffect, useRef } from "react";

const MessageContainer = () => {
  const { selectedChatData, selectedChatType, selectedChatMessages, userInfo } =
    useAppStore();
  const scrollRef = useRef();

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-4">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderPersonalMessages(message)}
        </div>
      );
    });
  };

  const renderPersonalMessages = (message) => (
    <div
      className={`flex flex-col ${
        message.sender === userInfo._id ? "items-end" : "items-start"
      } my-2`}
    >
      <div
        className={`${
          message.sender === userInfo._id
            ? "bg-gray-600 text-white"
            : "bg-purple-600 text-white"
        } p-3 rounded-lg max-w-xs break-words`}
      >
        {message.messageType === "text" && <div>{message.content}</div>}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
