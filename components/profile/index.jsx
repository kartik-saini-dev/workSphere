"use client"

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { FiCamera, FiUser, FiEdit3 } from "react-icons/fi";
import { GlobalContext } from "@/context";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notification from "../Notification";
function Profile() {
  const router = useRouter();
  const { data: { user: session } = {}, status } = useSession();
  const [imageHover, setImageHover] = useState(false);
  const [stats, setStatus] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    userName: "",
    fullName: "",
    description: "",
    img: "",
  });

  const { setPageLevelLoader } = useContext(GlobalContext);

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  useEffect(() => {
    const handleData = { ...data };
    if (session) {
      if (session?.name) handleData.userName = session?.name;
      if (session?.description) handleData.description = session?.description;
      if (session?.fullName) handleData.fullName = session?.fullName;
      setStatus(true);
      setData(handleData);
    }
  }, [session]);

  useEffect(() => {
    // If the session is not authenticated, show the login notification and redirect
   
  }, [status, router]);

  if (status === "error") {
    return <div className="text-center mt-20 text-lg text-red-600">Error loading session data</div>;
  }

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "o8kvmsp2"); // here upload preset from cloudinary 
    formData.append("cloud_name", "dc1kpjvo6"); // here cloudinary cloud name watch env file for it 

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dc1kpjvo6/image/upload",
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };


  const handleFile = (e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (file && validImageTypes.includes(file.type)) {
      setImage(file); // Store the selected file in state
      setErrorMessage(""); // Clear any previous error messages
    } else {
      setErrorMessage("Please upload a valid image (jpg, png, gif).");
    }
  };
  
  const setProfile = async () => {
    if (status === "unauthenticated") {
      toast.error("Please log in first to update your profile.");
      return;
    }
  
    setLoading(true);
    let uploadedImageUrl = data.img;
  
    try {
      // Upload the image only if it's newly selected
      if (image) {
        uploadedImageUrl = await uploadToCloudinary(image);
      }
  
      // Update the profile data
      const response = await axios.put(
        `/api/register/update?userId=${session?.userId}`,
        {
          ...data,
          img: uploadedImageUrl, // Use the uploaded image URL
        }
      );
  
      if (response.data.success) {
        toast.success("Profile updated successfully.");
      } else {
        toast.error("Error updating profile.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("An error occurred while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 p-4 focus:ring-green-500 focus:border-green-500 shadow-sm";
  const labelClassName = "mb-2 text-base font-medium text-gray-700";

  return (
    <>
      <Notification
      />
      <div className="flex flex-col items-center justify-start min-h-screen gap-8 p-6 sm:p-12 bg-gray-50">
        {errorMessage && (
          <div className="w-full text-center text-red-600 font-bold">
            {errorMessage}
          </div>
        )}
        <h2 className="text-4xl font-semibold text-gray-800">Complete Your Profile</h2>
        <p className="text-lg text-gray-600 mb-8">
          Let's set up your profile to get started on workSphere
        </p>
        <div className="flex flex-col items-center w-full gap-6 max-w-2xl bg-white shadow-md rounded-lg p-8">
          <div
            className="flex flex-col items-center cursor-pointer relative"
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
          >
            <div className="relative h-36 w-36 bg-gray-200 rounded-full overflow-hidden border-4 border-green-500">
              {session?.image || stats ? (
                <Image
                  src={image ? URL.createObjectURL(image) : session.image}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <span className="text-5xl text-gray-500 flex items-center justify-center h-full">
                  {session?.email[0]?.toUpperCase() || <FiUser />}
                </span>
              )}
              {imageHover && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <FiCamera className="text-white text-3xl" />
                  <input
                    type="file"
                    onChange={handleFile}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                </div>
              )}
            </div>
            <label className="text-sm text-gray-600 mt-2">Upload Profile Picture</label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col">
              <label className={labelClassName} htmlFor="userName">
                <FiEdit3 className="inline mr-2" />
                Username
              </label>
              <input
                className={inputClassName}
                type="text"
                name="userName"
                id="userName"
                placeholder="Enter username"
                value={data.userName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label className={labelClassName} htmlFor="fullName">
                <FiUser className="inline mr-2" />
                Full Name
              </label>
              <input
                className={inputClassName}
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Enter full name"
                value={data.fullName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label className={labelClassName} htmlFor="description">
              About You
            </label>
            <textarea
              name="description"
              id="description"
              value={data.description}
              onChange={handleChange}
              className={`${inputClassName} resize-none`}
              placeholder="Tell us something about yourself..."
            ></textarea>
          </div>

          <button
      className={`w-full text-lg font-semibold px-5 py-3 rounded-md transition-all duration-300 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 text-white"
      }`}
      type="button"
      onClick={!loading ? setProfile : null} // Prevent multiple clicks during loading
      disabled={loading} // Disable the button during loading
    >
           { !loading ?  "Save Profile" : "saving..."}
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
