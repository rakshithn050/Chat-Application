import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { X } from "lucide-react";
import React from "react";
import { HOST } from "../../../utils/constants";

const ChatHeader = () => {
  const { selectedChatData, closeChat, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] w-full border-b-2 border-t-gray-500 flex items-center justify-between px-10">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <AvatarFallback
                  className="h-12 w-12 text-lg border-[1px] flex items-center justify-center"
                  style={{
                    outline: `2px solid ${selectedChatData?.color}`,
                    outlineOffset: "2px",
                  }}
                >
                  {selectedChatData?.firstName
                    ? selectedChatData?.firstName.charAt(0).toUpperCase()
                    : selectedChatData?.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          {selectedChatType === "contact" ? (
            <div className="flex flex-col text-white font-semibold">
              <span>
                {selectedChatData?.firstName && selectedChatData?.lastName
                  ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}`
                  : ""}
              </span>
              <span>{selectedChatData?.email}</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex gap-5 items-center justify-center">
        <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <X className="text-3xl" onClick={closeChat} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
