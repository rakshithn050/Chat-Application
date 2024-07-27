import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizontal, SmilePlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { UPLOAD_FILE } from "../../../utils/constants";
import { apiClient } from "../../../lib/api-client.js"; // Import apiClient

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    addMessage,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef();
  const emojiButtonRef = useRef();
  const uploadAttachmentRef = useRef();
  const socket = useSocket();

  const handleAddEmoji = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleAttachmentLink = () => {
    if (uploadAttachmentRef.current) {
      uploadAttachmentRef.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) =>
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total)),
        });

        if (response.status === 201 && response.data) {
          setIsUploading(false);

          if (selectedChatType === "contact") {
            const data = {
              sender: userInfo,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            };

            socket.emit("sendMessage", data);
          } else if (selectedChatType === "channel") {
            const data = {
              sender: userInfo,
              content: undefined,
              channelId: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            };
            socket.emit("sendGroupMessage", data);
          }
        } else {
          console.log("Could not upload the file");
        }
      }
    } catch (error) {
      setIsUploading(false);

      console.log(error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      if (selectedChatType === "contact") {
        const data = {
          sender: userInfo,
          content: message,
          recipient: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        };

        socket.emit("sendMessage", data);

        addMessage(data);

        setMessage("");
      } else if (selectedChatType === "channel") {
        const data = {
          sender: userInfo,
          content: message,
          channelId: selectedChatData._id,
          messageType: "text",
          fileUrl: undefined,
        };
        socket.emit("sendGroupMessage", data);
        setMessage("");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerOpen &&
        emojiRef.current &&
        emojiButtonRef.current &&
        !emojiRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerOpen, emojiRef, emojiButtonRef]); // Include refs in dependency array

  return (
    <div className="h-[10vh] bg-gray-900 flex justify-center items-center px-4 md:px-8 mb-6 gap-4 md:gap-6">
      <div className="flex-1 flex bg-gray-800 rounded-md items-center gap-3 pr-3 md:pr-5">
        <input
          type="text"
          className="flex-1 p-3 bg-transparent focus:border-none focus:outline-none text-white placeholder-gray-400"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentLink}
        >
          <Paperclip className="text-xl md:text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={uploadAttachmentRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative" ref={emojiRef}>
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            ref={emojiButtonRef}
            onClick={() => {
              setEmojiPickerOpen((prev) => !prev); // Toggle emoji picker
            }}
          >
            <SmilePlus className="text-xl md:text-2xl" />
          </button>
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 z-10">
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-purple-600 rounded-md flex items-center justify-center p-3 hover:bg-purple-400 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <SendHorizontal className="text-xl md:text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
