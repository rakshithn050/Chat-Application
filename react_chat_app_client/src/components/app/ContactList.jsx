import { useAppStore } from "@/store";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HOST } from "../../../utils/constants.js";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5" data={console.log(contacts)}>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-purple-500 hover:bg-purple-400"
              : "bg-gray-700"
          }`}
          onClick={() => {
            handleClick(contact);
          }}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300">
            {!isChannel && (
              <div className="flex gap-3 items-center justify-center">
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact?.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <AvatarFallback
                      className="h-12 w-12 text-lg border-[1px] flex items-center justify-center"
                      style={{
                        outline: `2px solid ${contact?.color}`,
                        outlineOffset: "2px",
                      }}
                    >
                      {contact?.firstName
                        ? contact?.firstName.charAt(0).toUpperCase()
                        : contact?.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col text-white font-semibold">
                  <span>
                    {contact?.firstName && contact?.lastName
                      ? `${contact?.firstName} ${contact?.lastName}`
                      : ""}
                  </span>
                </div>
              </div>
            )}
            {isChannel && (
              <div className="flex gap-3 items-center justify-center">
                <div className="h-12 w-12 rounded-full text-lg border-[1px] flex items-center justify-center bg-purple-600 text-white">
                  {contact?.name[0].toUpperCase() ?? contact?.name}
                </div>
                <div className="flex flex-col text-white font-semibold">
                  <span>{contact?.name}</span>
                  <span>{contact?.members?.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
