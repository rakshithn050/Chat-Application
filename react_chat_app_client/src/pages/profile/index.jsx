import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { apiClient } from "../../../lib/api-client.js";
import { MoveLeft, XCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ADD_PROFILE_IMAGE,
  HOST,
  UPDATE_USER_PROFILE,
} from "../../../utils/constants.js";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: userInfo.userData?.firstName ? userInfo.userData.firstName : "",
    lastName: userInfo.userData?.lastName ? userInfo.userData.lastName : "",
    image: userInfo.userData?.image ? userInfo.userData.image : null,
  });
  const [colors, setColors] = useState([
    "#FEB2B2",
    "#BFDBFE",
    "#C6F6D5",
    "#FEFCBF",
    "#FBD38D",
  ]);
  const [selectedColor, setSelectedColor] = useState(
    userInfo.userData?.color ? userInfo.userData.color : "#BFDBFE"
  );
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const fileInput = useRef();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prevData) => ({ ...prevData, image: reader.result }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await apiClient.post(ADD_PROFILE_IMAGE, formData, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserInfo((prevData) => ({
            ...prevData,
            image: response.data.image,
          }));
          toast.success("Profile Image Added Successfully");
        }
      } catch (error) {
        toast.error(
          `Could not upload the image. ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const removeImage = () => {
    setUserData((prevData) => ({ ...prevData, image: null }));
    setUserInfo((prevData) => ({ ...prevData, image: null }));
  };

  const handleValidation = () => {
    let isValid = true;
    if (!userData.firstName.trim()) {
      setFirstNameError("First name is required");
      isValid = false;
    } else {
      setFirstNameError("");
    }
    if (!userData.lastName.trim()) {
      setLastNameError("Last name is required");
      isValid = false;
    } else {
      setLastNameError("");
    }
    return isValid;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      if (handleValidation()) {
        const firstName = userData.firstName.trim();
        const lastName = userData.lastName.trim();
        const response = await apiClient.put(
          UPDATE_USER_PROFILE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 201) {
          toast.success("Profile Updated Successfully");
        }
        setTimeout(() => {
          navigate("/chat");
        }, 2000);
      }
    } catch (error) {
      toast.error(
        `Could not update your profile. ${
          error.response?.data?.message || error.message
        }`
      );
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
                {userData.image || userInfo.image ? (
                  <AvatarImage
                    src={
                      userData.image
                        ? userData.image
                        : `${HOST}/${userInfo.image}`
                    }
                    className="cursor-pointer group-hover:opacity-25"
                    onClick={() => {
                      fileInput.current.click();
                    }}
                  />
                ) : (
                  <div
                    className="text-3xl font-bold cursor-pointer h-full w-full flex justify-center items-center"
                    style={{
                      backgroundColor: selectedColor,
                    }}
                    onClick={() => {
                      fileInput.current.click();
                    }}
                  >
                    {userData.firstName
                      ? userData.firstName.charAt(0).toUpperCase()
                      : userInfo?.userData?.email.charAt(0).toUpperCase()}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInput}
                  name="profileImage"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer hidden"
                />
              </Avatar>

              {(userData.image || userInfo.image) && (
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

          <form className="space-y-4 w-full" onSubmit={saveProfile}>
            <Input
              type="text"
              placeholder="First Name"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
              value={userData.firstName}
              onChange={(e) =>
                setUserData((prevData) => ({
                  ...prevData,
                  firstName: e.target.value,
                }))
              }
            />
            {firstNameError && (
              <p className="text-red-500 text-sm">{firstNameError}</p>
            )}
            <Input
              type="text"
              placeholder="Last Name"
              className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
              value={userData.lastName}
              onChange={(e) =>
                setUserData((prevData) => ({
                  ...prevData,
                  lastName: e.target.value,
                }))
              }
            />
            {lastNameError && (
              <p className="text-red-500 text-sm">{lastNameError}</p>
            )}
            <Input
              type="email"
              placeholder="Email"
              className="w-full text-sm text-gray-800 bg-gray-200 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600 focus:border-none focus-visible:ring-1"
              value={userInfo?.userData?.email}
              readOnly
            />

            <Button
              type="submit"
              className="text-white bg-[#007bff] hover:bg-blue-600 font-semibold rounded-md text-sm px-4 py-2.5 w-full"
            >
              Update Profile
            </Button>

            {/* <button
              className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-500 hover:text-white w-full"
              // onClick={deleteProfile}
            >
              Delete Profile
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
