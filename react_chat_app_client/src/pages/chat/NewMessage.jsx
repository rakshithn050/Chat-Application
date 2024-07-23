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
import { MessageSquareDiff } from "lucide-react";
import React, { useState } from "react";
import Lottie from "react-lottie";

const NewMessage = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {};
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
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length <= 0 ? (
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
          ) : (
            ""
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewMessage;
