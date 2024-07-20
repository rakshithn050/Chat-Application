import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import React from "react";
import { HOST } from "../../../utils/constants.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { LogOut, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      alert("h");
    } catch (error) {}
  };

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-4 md:px-10 w-full bg-gray-700 shadow-lg">
      <div className="flex items-center justify-center space-x-4">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo?.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <AvatarFallback
                className="h-12 w-12 text-lg border-[1px] flex items-center justify-center"
                style={{
                  outline: `2px solid ${userInfo?.color}`,
                  outlineOffset: "2px",
                }}
              >
                {userInfo?.firstName
                  ? userInfo?.firstName.charAt(0).toUpperCase()
                  : userInfo?.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="text-white font-semibold">
          {userInfo?.firstName && userInfo?.lastName
            ? `${userInfo?.firstName} ${userInfo?.lastName}`
            : ""}
        </div>
        <div className="flex justify-center items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Pencil
                  className="text-purple-500 text-xl cursor-pointer hover:text-purple-400 transition duration-200"
                  onClick={() => {
                    navigate("/profile");
                  }}
                />
              </TooltipTrigger>
              <TooltipContent className="text-sm bg-gray-800 text-white border-none">
                Edit Profile
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <LogOut
                  className="text-red-500 text-xl cursor-pointer hover:text-purple-400 transition duration-200"
                  onClick={() => {
                    logout();
                  }}
                />
              </TooltipTrigger>
              <TooltipContent className="text-sm bg-gray-800 text-white border-none">
                Logout
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
