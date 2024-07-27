import Title from "@/components/app/Title";
import React, { useEffect } from "react";
import ProfileCard from "./ProfileCard";
import NewMessage from "./NewMessage";
import { apiClient } from "../../../lib/api-client.js";
import {
  GET_CONTACTS_FOR_MESSAGES,
  GET_PERSONALIZED_CHANNELS,
} from "../../../utils/constants.js";
import { useAppStore } from "@/store";
import ContactList from "@/components/app/ContactList";
import CreateChannel from "./CreateChannel";

const ContactsContainer = () => {
  const { messagedContacts, setMessagedContacts, channels, setChannels } =
    useAppStore();

  useEffect(() => {
    getContacts();
    getChannels();
  }, []);

  const getContacts = async () => {
    const response = await apiClient.get(GET_CONTACTS_FOR_MESSAGES, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setMessagedContacts(response.data?.contacts);
    }
  };

  const getChannels = async () => {
    const response = await apiClient.get(GET_PERSONALIZED_CHANNELS, {
      withCredentials: true,
    });
    if (response.status === 200) {
      setChannels(response.data?.channels);
    }
  };

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gray-800 border-r-2 border-gray-500 w-full">
      <div>
        <img src={"/assets/logo.png"} alt="logo" className="h-[10vh] w-full" />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Direct Messages"} />
          <NewMessage />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={messagedContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Channels"} />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channels} isChannel={true} />
        </div>
      </div>
      <ProfileCard />
    </div>
  );
};

export default ContactsContainer;
