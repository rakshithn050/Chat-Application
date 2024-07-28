import { useAppStore } from "@/store";
import { apiClient } from "../../../lib/api-client.js";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES,
  HOST,
} from "../../../utils/constants.js";
import { CircleX, Download, File } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.jsx";

const MessageContainer = () => {
  const {
    selectedChatData,
    selectedChatType,
    selectedChatMessages,
    userInfo,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const scrollRef = useRef();

  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;

    return imageRegex.test(filePath);
  };

  const handleDownloadFile = async (fileUrl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    try {
      const response = await apiClient.get(`${HOST}/${fileUrl}`, {
        responseType: "blob",
        onDownloadProgress: (progress) => {
          const { loaded, total } = progress;
          const downloadProgress = Math.round((loaded * 100) / total);
          setFileDownloadProgress(downloadProgress);
        },
      });
      const urlBlob = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  };

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
            {selectedChatType === "channel" && renderGroupMessages(message)}
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
        message.sender === userInfo.id ? "items-start" : "items-end"
      } my-2`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender === userInfo.id
              ? "bg-gray-600 text-white"
              : "bg-purple-600 text-white"
          } p-3 rounded-lg max-w-xs break-words shadow-md`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender === userInfo.id
              ? "bg-gray-600 text-white"
              : "bg-purple-600 text-white"
          } p-3 rounded-lg max-w-xs break-words shadow-md`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                className="object-cover h-48 w-72 rounded-md"
                alt={message.fileUrl.split("/").pop()}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <File className="text-white" />
              <a
                href={`${HOST}/${message.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white break-words"
                style={{ wordBreak: "break-all" }}
              >
                {message.fileUrl.split("/").pop()}
              </a>
              <Download
                className="text-white cursor-pointer"
                onClick={() => {
                  handleDownloadFile(message.fileUrl);
                }}
              />
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-1">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderGroupMessages = (message) => (
    <div
      className={`flex flex-col ${
        message.sender.id === userInfo.id || message.sender._id === userInfo.id
          ? "items-end"
          : "items-start"
      } my-2`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender.id === userInfo.id ||
            message.sender._id === userInfo.id
              ? "bg-purple-600 text-white"
              : "bg-gray-600 text-white"
          } p-3 rounded-lg max-w-xs break-words shadow-md`}
        >
          {message.content}
        </div>
      )}
      {message.sender.id !== userInfo.id &&
        message.sender._id !== userInfo.id && (
          <div className="flex items-center gap-3 mt-1">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {message.sender?.image && (
                <>
                  <AvatarImage
                    src={`${HOST}/${message.sender.image}`}
                    className="object-cover w-full h-full bg-black"
                  />
                  <AvatarFallback
                    className="h-8 w-8 text-lg border-[1px] flex items-center justify-center bg-gray-700 text-white"
                    style={{
                      outline: `2px solid ${message.sender?.color}`,
                      outlineOffset: "2px",
                    }}
                  >
                    {message.sender?.firstName
                      ? message.sender?.firstName.charAt(0).toUpperCase()
                      : message.sender?.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <span className="text-sm text-white/60 truncate max-w-[150px]">
              {message.sender?.firstName && message.sender?.lastName
                ? `${message.sender?.firstName} ${message.sender?.lastName}`
                : `${message.sender?.email}`}
            </span>
          </div>
        )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender === userInfo.id
              ? "bg-gray-600 text-white"
              : "bg-purple-600 text-white"
          } p-3 rounded-lg max-w-xs break-words shadow-md`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                className="object-cover h-48 w-72 rounded-md"
                alt={message.fileUrl.split("/").pop()}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <File className="text-white" />
              <a
                href={`${HOST}/${message.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white break-words"
                style={{ wordBreak: "break-all" }}
              >
                {message.fileUrl.split("/").pop()}
              </a>
              <Download
                className="text-white cursor-pointer"
                onClick={() => {
                  handleDownloadFile(message.fileUrl);
                }}
              />
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-1">
        {moment(message.createdAt).format("LT")}
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
    const getChannelMessages = async () => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSelectedChatMessages(response.data?.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChatType === "contact" && selectedChatData?._id) {
      getMessages();
    } else if (selectedChatType === "channel" && selectedChatData?._id) {
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed mt-0 z-10 top-0 left-0 h-screen w-screen flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="object-cover h-[80vh] w-full bg-cover rounded-md"
              alt="image"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                handleDownloadFile(imageURL);
              }}
            >
              <Download className="text-white cursor-pointer" />
            </button>
            <button
              className="bg-black/20 p-3 rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <CircleX className="text-white cursor-pointer" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
