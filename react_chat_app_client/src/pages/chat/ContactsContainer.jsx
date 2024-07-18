import Title from "@/components/app/Title";
import React from "react";

const ContactsContainer = () => {
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-gray-800 border-r-2 border-gray-500 w-full">
      <div className="pt-3">Logo</div>
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
    </div>
  );
};

export default ContactsContainer;
