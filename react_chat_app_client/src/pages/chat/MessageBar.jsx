import EmojiPicker from "emoji-picker-react";
import { Paperclip, SendHorizontal, SmilePlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef();
  const emojiButtonRef = useRef();

  const handleAddEmoji = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  // Close emoji picker when clicking outside
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
  }, [emojiPickerOpen]);

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
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <Paperclip className="text-xl md:text-2xl" />
        </button>
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
