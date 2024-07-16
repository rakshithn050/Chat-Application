import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { Lock, Mail, MoveLeft, XCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: null,
    lastName: null,
    image: null,
  });
  const [colors, setColors] = useState([
    "#FEB2B2",
    "#BFDBFE",
    "#C6F6D5",
    "#FEFCBF",
    "#FBD38D",
  ]);
  const [selectedColor, setSelectedColor] = useState("#BFDBFE");
  const fileInput = useRef();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({ ...prevData, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUserData((prevData) => ({ ...prevData, image: null }));
  };

  const saveProfile = async () => {
    try {
      // Save profile logic here
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-4xl">
        <div className="mb-4">
          <Button
            type="button"
            className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <MoveLeft className="w-4" />
            Back
          </Button>
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center mb-8">
          Complete your Profile
        </h1>
        <div className="grid sm:grid-cols-2 items-center gap-8 p-4">
          <div className="flex flex-col justify-center items-center gap-5">
            <div className="relative group">
              <Avatar
                className="relative flex items-center justify-center h-40 w-40"
                style={{
                  outline: `2px solid ${selectedColor}`,
                  outlineOffset: "2px",
                }}
              >
                {userData.image ? (
                  <AvatarImage
                    src={userData.image}
                    className="cursor-pointer group-hover:opacity-25"
                    onClick={() => {
                      fileInput.current.click();
                    }}
                  />
                ) : (
                  <>
                    <div
                      className="text-3xl font-bold cursor-pointer h-full w-full flex justify-center items-center"
                      style={{
                        backgroundColor: selectedColor,
                      }}
                      onClick={() => {
                        fileInput.current.click();
                      }}
                    >
                      {userData.firstName && userData.firstName !== ""
                        ? userData?.firstName.charAt(0).toUpperCase()
                        : userInfo?.userData?.email.charAt(0).toUpperCase()}
                    </div>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer hidden"
                />
              </Avatar>

              {userData.image && (
                <div
                  onClick={removeImage}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button className="text-red-600 hover:text-red-800">
                    <XCircle className="w-6 h-6 mx-auto" />
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            <p className="text-center text-gray-600">
              Customize Your Profile Color & Profile Image
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              {colors.map((profileColor, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedColor(profileColor);
                  }}
                  style={{
                    backgroundColor: profileColor,
                    height: "2rem",
                    width: "2rem",
                    cursor: "pointer",
                    borderRadius: "50%",
                    transition: "all 0.3s",
                    outline:
                      selectedColor === profileColor
                        ? `3px solid ${profileColor}`
                        : "none",
                    outlineOffset: "2px",
                  }}
                ></div>
              ))}
            </div>
          </div>

          <form className="space-y-4 w-full">
            <Input
              type="text"
              placeholder="First Name"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
              value={userData.firstName || ""}
              onChange={(e) =>
                setUserData((prevData) => ({
                  ...prevData,
                  firstName: e.target.value,
                }))
              }
            />
            <Input
              type="text"
              placeholder="Last Name"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
              value={userData.lastName || ""}
              onChange={(e) =>
                setUserData((prevData) => ({
                  ...prevData,
                  lastName: e.target.value,
                }))
              }
            />
            <Input
              type="email"
              placeholder="Email"
              className="w-full text-sm text-gray-800 bg-gray-200 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
              value={userInfo?.userData?.email}
              readOnly
            />

            <Button
              type="button"
              className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 w-full"
              onClick={saveProfile}
            >
              Update Profile
            </Button>

            <button className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-500 hover:text-white w-full">
              Delete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
