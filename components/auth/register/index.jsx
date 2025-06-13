"use client";
import { toast } from "react-toastify";
import Notification from "@/components/Notification";
import { useState } from "react";
import { registerNewUser } from "@/apicalls/register/index";
import "./register.css"

const initialFormData = {
  username: "",
  email: "",
  password: "",
  img: "",
  country: "",
  phone: "", 
  isSeller: false,
  desc: "",
}
export default function Register() {

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setloading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  function isFormValid() {
    return formData &&
      formData.username &&
      formData.username.trim() !== "" &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== "" &&
      formData.country &&
      formData.country.trim() !== ""
      ? true
      : false;
  }
  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setFormData((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };
  async function handleSubmit() {
    setloading(true); 
    // <RingLoader
    //   color={"#000000"}
    //   loading={isVerifying}
    //   size={60}
    //   data-testid="loader"
    // />
    const res = await registerNewUser(formData);


    if (res?.success) {
      setloading(false);
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });

      setFormData(initialFormData);

    } else {
      toast.error(res?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setloading(false);
      setFormData(initialFormData);
    }
  }

  const apiKey = "your-virustotal-api-key";

  // Scan for Malware Function
  async function scanForMalware(file) {
    const url = "https://www.virustotal.com/api/v3/files";
    const headers = {
      "x-apikey": apiKey,
    };

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(url, formData, { headers });
      const fileId = response.data.data.id;
      const fileScanUrl = `https://www.virustotal.com/api/v3/files/${fileId}`;
      const scanResponse = await axios.get(fileScanUrl, { headers });
      const scanResults = scanResponse.data.data.attributes.last_analysis_results;

      const isInfected = Object.values(scanResults).some(
        (result) => result.category === "malicious"
      );
      return isInfected;
    } catch (error) {
      console.error("Error scanning for malware:", error.message);
      toast.error("Error scanning file. Please try again.");
      return true; // Assume malicious if scanning fails
    }
  }

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "...."); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "........"); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/your cloudinary cloud name/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("File upload failed. Please try again.");
      throw error;
    }
  };

  // Remove from Cloudinary
  const removeFromCloudinary = async (publicId) => {
    try {
      const response = await fetch("/api/cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileURL: publicId }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete image from Cloudinary");
      }
    } catch (error) {
      console.error("Error removing image from Cloudinary:", error);
      toast.error("Failed to remove image. Please try again.");
    }
  };

  // Handle Image Upload
  const handleImage = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Validate File Type and Size
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPEG, PNG, or GIF file.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size exceeds 5MB limit. Please upload a smaller file.");
      return;
    }

    // Scan for Malware
    // const isInfected = await scanForMalware(file);
    // if (isInfected) {
    //   toast.error("Malicious file detected. Please upload a clean file.");
    //   return;
    // }

    // Remove Previous Image if Exists
    if (formData.img) {
      await removeImage(formData.img);
    }

    // Upload to Cloudinary
    try {
      const imageUrl = await uploadToCloudinary(file);
      setFormData({ img: imageUrl });
      setPreviewImage(imageUrl);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image.");
    }
  };

  // Handle Image Removal
  const removeImage = async (url) => {


    try {
      await removeFromCloudinary(url); // Remove from Cloudinary
      setFormData({ img: null });
      setPreviewImage(null);
      toast.success("Image removed successfully!");
    } catch {
      toast.error("Failed to remove image.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen my-20">
      <form className="w-full max-w-3xl p-10 bg-white border rounded-lg shadow-md flex">
        <div className="flex-1 space-y-6 pr-6">
          <h1 className="text-gray-800 text-3xl font-semibold mb-6">Create a new account</h1>

          <div className="flex space-x-4">
            <div className="w-1/2 space-y-4">
              <label htmlFor="username" className="text-gray-600">Username</label>
              <input
                name="username"
                type="text"
                placeholder="johndoe"
                onChange={handleChange}
                value={formData.username}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="w-1/2 space-y-4">
              <label htmlFor="email" className="text-gray-600">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                placeholder="email@example.com"
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="password" className="text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="file" className="text-gray-600">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              onChange={handleImage}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            {previewImage && (
              <div className="mt-4">
                <img
                  src={previewImage}
                  alt="Selected Preview"
                  className="w-32 h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button" // Prevents default form submission behavior
                  onClick={() => removeImage(formData.img)} // Calls the removeImage function
                  className="mt-2 text-red-500"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <div className="w-1/2 space-y-4">
            <label htmlFor="country" className="text-gray-600">Country</label>
            <input
              name="country"
              type="text"
              placeholder="Usa"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-blue-500 px-6 py-4 text-lg 
                     text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                     "
            disabled={!isFormValid()}
            onClick={handleSubmit}
          >
            {loading ? (
              "Registering..."
            ) : (
              "Register"
            )}
          </button>
        </div>

        <div className="flex-1 space-y-6 pl-6">
          <h1 className="text-3xl text-gray-800 font-semibold">Become a seller</h1>

          <div className="toggle">
            <label htmlFor="">Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="w-full space-y-4">
            <label htmlFor="phone" className="text-gray-600">Phone Number(optional)</label>
            <input
              name="phone"
              type="text"
              value={formData.phone}
              placeholder="+1 234 567 89"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full space-y-4">
            <label htmlFor="desc" className="text-gray-600">Description(optional)</label>
            <textarea
              placeholder="A short description of yourself"
              name="desc"
              value={formData.desc}
              id=""
              cols="30"
              rows="6"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>
        </div>
      </form>
      <Notification />
    </div>
  );
}  