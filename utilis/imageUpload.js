

"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Plus, Loader } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({ onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onUpload = (result) => {
    setUploading(false);
    setProgress(0);

    if (result.info && Array.isArray(result.info.files)) {
      // Handle multiple files
      const uploadedUrls = result.info.files.map((file) => file.uploadInfo.secure_url);
      onChange(uploadedUrls);
    } else if (result.info && result.info.secure_url) {
      // Handle single file
      onChange([result.info.secure_url]);
    } else {
      console.error("Unexpected result format:", result);
    }
  };

  const handleProgress = (e) => {
    if (e.lengthComputable) {
      const percentComplete = Math.round((e.loaded / e.total) * 100);
      setProgress(percentComplete);
    }
  };

  return (
    <div>
      <CldUploadWidget
        uploadPreset="o8kvmsp2" // here your cloudinary upload preset 
        onUpload={onUpload} // Trigger on upload complete
        onProgress={handleProgress} // Track upload progress
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => {
              setUploading(true);
              open();
            }}
            className="flex items-center px-4 py-2 bg-gray-300  rounded-lg hover:bg-blue-500 "
          >
            {uploading ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {uploading ? `Uploading (${progress}%)` : "Upload Images"}
          </button>
        )}
     
      </CldUploadWidget>

      {uploading && progress > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Uploading: {progress}% completed
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

