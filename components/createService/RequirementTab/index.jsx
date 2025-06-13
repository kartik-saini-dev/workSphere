"use client";

import { FaListUl, FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { useState, useContext } from "react";
import { GlobalContext } from "@/context"; // Adjust the import path to your context file

const RequirementsTab = () => {
  const { serviceData, setserviceData } = useContext(GlobalContext); // Access global context
  const [requirements, setRequirements] = useState(
    serviceData?.requirements || [{ question: "", type: "Free Text" }]
  );

  // Function to handle adding a new requirement
  const addRequirement = () => {
    const newRequirements = [...requirements, { question: "", type: "Free Text" }];
    setRequirements(newRequirements);
    setserviceData((prevData) => ({ ...prevData, requirements: newRequirements })); // Update context
  };

  // Function to handle removing a requirement
  const removeRequirement = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
    setserviceData((prevData) => ({ ...prevData, requirements: updatedRequirements })); // Update context
  };

  // Function to handle changes in a specific requirement
  const handleRequirementChange = (index, key, value) => {
    const updatedRequirements = requirements.map((req, i) =>
      i === index ? { ...req, [key]: value } : req
    );
    setRequirements(updatedRequirements);
    setserviceData((prevData) => ({ ...prevData, requirements: updatedRequirements })); // Update context
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <FaListUl className="text-blue-500 text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">service Requirements</h2>
      </div>
      <p className="text-gray-600 mb-6 text-lg">
        Specify the information you need from the buyer to start working on the service. This ensures clarity and smooth communication.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {requirements.map((requirement, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm relative">
            <label className="block text-lg font-semibold text-gray-700">
              Requirement Question
            </label>
            <input
              type="text"
              placeholder="e.g., What details should I know to begin?"
              value={requirement.question}
              onChange={(e) =>
                handleRequirementChange(index, "question", e.target.value)
              }
              className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <small className="text-gray-500 block mt-1">
              Add specific questions to collect clear responses from buyers.
            </small>

            <label className="block text-lg font-semibold text-gray-700 mt-4">
              Type of Response
            </label>
            <div className="relative">
              <select
                value={requirement.type}
                onChange={(e) =>
                  handleRequirementChange(index, "type", e.target.value)
                }
                className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option>Free Text</option>
                <option>File Upload</option>
              </select>
              <span className="absolute top-2 right-3 text-gray-500">
                <FaListUl />
              </span>
            </div>

            {/* Remove Requirement Button */}
            <button
              onClick={() => removeRequirement(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
            >
              <FaTrashAlt className="text-lg" />
            </button>
          </div>
        ))}

        {/* Add Requirement Button */}
        <button
          onClick={addRequirement}
          className="flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          <FaPlusCircle className="text-lg" />
          Add Another Requirement
        </button>
      </div>
    </div>
  );
};

export default RequirementsTab;
