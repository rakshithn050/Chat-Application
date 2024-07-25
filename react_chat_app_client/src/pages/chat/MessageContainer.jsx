import { useAppStore } from "@/store";
import { apiClient } from "../../../lib/api-client.js";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import { GET_MESSAGES } from "../../../utils/constants.js";

const MessageContainer = () => {
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    userInfo,
    setSelectedChatMessages,
  } = useAppStore();
  const scrollRef = useRef();

  const renderMessages = () => {
    let lastDate = null;
    if (selectedChatMessages.length !== 0) {
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
    } else {
      return (
        <div className="text-center text-gray-500 my-4">
          No messages to display.
        </div>
      );
    }
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

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES,
          {
            receiverId: selectedChatData._id,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSelectedChatMessages(response.data?.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
