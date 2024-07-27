import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "../../../lib/api-client.js";
import { MessageSquareDiff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { GET_ALL_CONTACTS } from "../../../utils/constants.js";
import { useAppStore } from "@/store/index.js";
import { Button } from "@/components/ui/button.jsx";
import MultipleSelector from "@/components/ui/multiselect.jsx";

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

const CreateChannel = () => {
  const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState([]);

  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
    const response = await apiClient.get(GET_ALL_CONTACTS, {
      withCredentials: true,
    });

    if (response.status === 200) {
      setAllContacts(response.data.contacts);
    }
  };

  const CreateChannel = async () => {};

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MessageSquareDiff
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="border-none mb-2 p-3 text-white">
            Create new channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
        <DialogContent className="bg-gray-700 border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create a new channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Channel"
              className="rounded-lg p-6 bg-gray-600 border-none outline-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-gray-600 border-none p-2 text-white outline-none"
              defaultOptions={allContacts}
              placeholder="Search for contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-5 text-gray-600">
                  No contacts found
                </p>
              }
            />
          </div>
          <div>
            <Button className="w-full bg-purple-600 hover:bg-purple-900 transition-all duration-300">
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
