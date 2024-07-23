import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { animationDefaultOptions } from "@/lib/utils";
import { apiClient } from "../../../lib/api-client.js";
import { MessageSquareDiff } from "lucide-react";
import React, { useState, useCallback } from "react";
import Lottie from "react-lottie";
import { GET_CONTACTS, HOST } from "../../../utils/constants.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/index.js";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const NewMessage = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          GET_CONTACTS,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSearchedContacts(response.data);
        }
      } else {
        setSearchedContacts([]);
      }
    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  const debouncedSearchContacts = useCallback(debounce(searchContacts, 300), [
    searchContacts,
  ]);

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MessageSquareDiff
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-gray-700 border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-gray-600 border-none outline-none"
              onChange={(e) => debouncedSearchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px] rounded-md p-4">
            <div className="flex flex-col gap-5">
              {searchedContacts.length > 0 ? (
                searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => {
                      selectNewContact(contact);
                    }}
                  >
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">
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
                    </div>
                    <div className="flex flex-col text-white font-semibold">
                      <span>
                        {contact?.firstName && contact?.lastName
                          ? `${contact?.firstName} ${contact?.lastName}`
                          : ""}
                      </span>
                      <span>{contact?.email}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 bg-gray-700 md:flex flex-col justify-center items-center hidden duration-1000 transition-all">
                  <Lottie
                    isClickToPauseDisabled={true}
                    height={100}
                    width={100}
                    options={animationDefaultOptions}
                  />
                  <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                    <h3 className="poppins-medium">
                      Hii <span className="text-purple-500">!</span> Search new
                      <span className="text-purple-500"> Contact</span>
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewMessage;
