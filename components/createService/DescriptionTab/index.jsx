"use client";

import { FaFileAlt } from "react-icons/fa";
import { useContext } from "react";
import { GlobalContext } from "@/context"; // Adjust the import path as needed

const DescriptionTab = () => {
  const { serviceData, setserviceData } = useContext(GlobalContext);

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setserviceData((prev) => ({
      ...prev,
      description,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <FaFileAlt className="text-blue-500 text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">service Description</h2>
      </div>
      <p className="text-gray-600 mb-6 text-lg">
        Add a detailed description of your service to inform buyers about the services you offer, deliverables, and timelines.
      </p>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={serviceData?.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Write an engaging and detailed service description. Include benefits, specific deliverables, and your process."
            className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
          <small className="text-gray-500 block mt-1">
            Use at least 120 words to provide buyers with all the necessary information.
          </small>
        </div>
      </div>
    </div>
  );
};

export default DescriptionTab;
