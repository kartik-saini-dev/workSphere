

"use client"
import { FaCloudUploadAlt } from "react-icons/fa";
import ImageUpload from "@/utilis/imageUpload";
import Image from "next/image";
import { useContext, useState } from "react";
import { GlobalContext } from "@/context"; // Adjust the import path as necessary
import { Trash } from "lucide-react";

const GalleryTab = () => {
  const { serviceData, updateImages, updateImageURL, updateVideoURL } =
    useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "...."); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "........"); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/your cloudinary cloud name/video/upload", // Use the video upload URL
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; // Return the video URL
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true); // Show a loading indicator
      try {
        // Upload file to Cloudinary
        const videoURL = await uploadToCloudinary(file);
        updateVideoURL(videoURL); // Update the video URL in your context
      } catch (error) {
        console.error("Error uploading video:", error);
      } finally {
        setIsLoading(false); // Hide the loading indicator
      }
    }
  };
  const removeFromCloudinary = async (publicId) => {
    try {
      const response = await fetch("/api/cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileURL:publicId }), // Send the public ID to your API route
      });
      const result = await response.json();
    
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete video from Cloudinary");
      }
    } catch (error) {
      console.error("Error removing video from Cloudinary:", error);
    }
  };
  const removeVideo = async () => {
    if (serviceData?.videoURL) {
      await removeFromCloudinary(serviceData.videoURL); // Remove from Cloudinary
    }
    updateVideoURL(null); // Remove from state/context
  };

  const removeImage = async (url) => {
    updateImageURL(url);
      await removeFromCloudinary(url); // Remove from Cloudinary
    
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <FaCloudUploadAlt className="text-blue-500 text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">service Gallery</h2>
      </div>
      <p className="text-gray-600 mb-6 text-lg">
        Showcase your work by uploading images, videos, or documents. High-quality media attracts more buyers!
      </p>

      <div className="grid grid-cols-1 gap-6">
        {/* Display Images */}
        <div className="mt-4 flex flex-wrap gap-4">
          {serviceData?.images?.length > 0 ? (
            serviceData.images.map((url) => (
              <div key={url} className="relative group">
                <Image
                  src={url}
                  alt="Uploaded Image"
                  className="object-cover rounded-lg"
                  width={350}
                  height={350}
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-2 hidden group-hover:block"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p>No images uploaded yet.</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Upload Images
          </label>
          <ImageUpload onChange={updateImages} />
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: JPG, PNG. Max size: 5MB per image.
          </p>
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Upload Video (Optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {isLoading && <p className="text-blue-500 mt-2">Uploading video...</p>}
          {serviceData?.videoURL && (
            <div className="mt-4 flex flex-col items-center">
              <div className="w-full max-w-lg">
                <video
                  src={serviceData.videoURL}
                  controls
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <button
                type="button"
                onClick={() => removeVideo()}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Remove Video
              </button>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: MP4, AVI. Max size: 50MB.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GalleryTab;
