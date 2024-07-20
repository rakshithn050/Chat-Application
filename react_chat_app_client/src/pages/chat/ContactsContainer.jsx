import Title from "@/components/app/Title";
import React from "react";
import ProfileCard from "./ProfileCard";

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gray-800 border-r-2 border-gray-500 w-full">
      <div>
        <img src={"/assets/logo.png"} alt="logo" className="h-[10vh] w-full" />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Direct Messages"} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text={"Channels"} />
        </div>
      </div>
      <ProfileCard />
    </div>
  );
};

export default ContactsContainer;
