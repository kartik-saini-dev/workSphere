
"use client";
import {
  FaCode,
  FaPaintBrush,
  FaPenNib,
  FaVideo,
  FaMicrophone,
  FaChartBar,
} from "react-icons/fa";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "@/context"; // Adjust the import path to your context file

// Categories data
export const categories = [
  { name: "Graphic & Design", subcategories: ["Logo Design", "Branding", "Illustration"] },
  { name: "Video & Animation", subcategories: ["Video Editing", "3D Animation", "Motion Graphics"] },
  { name: "Writing & Translation", subcategories: ["Copywriting", "Proofreading", "Translation"] },
  { name: "AI Services", subcategories: ["Chatbot Development", "AI Models", "AI Art"] },
  { name: "Digital Marketing", subcategories: ["SEO", "Social Media Marketing", "Content Marketing"] },
  { name: "Music & Audio", subcategories: ["Voice Over", "Audio Editing", "Music Production"] },
  { name: "Programming & Tech", subcategories: ["Web Development", "App Development", "Blockchain"] },
  { name: "Business", subcategories: ["Consulting", "Virtual Assistant", "Data Entry"] },
  { name: "Lifestyle", subcategories: ["Fitness", "Personal Coaching", "Gaming"] },
];

const OverviewTab = () => {
  const { setserviceData, serviceData } = useContext(GlobalContext); // Access global context

  const [localserviceData, setLocalserviceData] = useState({
    title: serviceData?.title || "",
    category: serviceData?.category || "",
    keywords: serviceData?.keywords || [],
    shortDescription: serviceData?.shortDescription || "",
  });

  const [subcategories, setSubcategories] = useState([]);

  // Populate localserviceData when serviceData changes
  useEffect(() => {
    if (serviceData) {
      setLocalserviceData({
        title: serviceData.title || "",
        category: serviceData.category || "",
        keywords: serviceData.keywords || [],
        shortDescription: serviceData.shortDescription || "",
      });

      // Update subcategories when category changes
      const categoryObj = categories.find((cat) => cat.name === serviceData.category);
      setSubcategories(categoryObj ? categoryObj.subcategories : []);
    }
  }, [serviceData]);

  // Handle changes for individual fields
  const handleChange = (key, value) => {
    const updatedData = { ...localserviceData, [key]: value };
  
    if (key === "category") {
      const categoryObj = categories.find((cat) => cat.name === value);
  
      // Reset keywords when category changes
      setSubcategories(categoryObj ? categoryObj.subcategories : []);
      updatedData.keywords = []; // Clear keywords in local state
  
      // Clear keywords in global context
      setserviceData((prevData) => ({ ...prevData, keywords: [], category: value }));
    } else {
      setserviceData((prevData) => ({ ...prevData, [key]: value })); // Sync other changes with global context
    }
  
    setLocalserviceData(updatedData); // Update local state
  };
  

  // Handle keyword selection
  const handleKeywordChange = (keyword) => {
    const updatedKeywords = localserviceData.keywords.includes(keyword)
      ? localserviceData.keywords.filter((kw) => kw !== keyword)
      : [...localserviceData.keywords, keyword];

    handleChange("keywords", updatedKeywords);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">service Overview</h2>
      <p className="text-gray-600 mb-6 text-lg">
        Start by adding an eye-catching title, selecting the right category, and providing essential details about your service.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* service Title */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">service Title</label>
          <input
            type="text"
            placeholder="I will create a stunning website for you..."
            value={localserviceData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <small className="text-gray-500 block mt-1">Make your title unique and engaging.</small>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-lg font-semibold text-gray-700">Category</label>
          <select
            value={localserviceData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Keywords Selection */}
        <div className="col-span-2">
          <label className="block text-lg font-semibold text-gray-700">Keywords</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {subcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => handleKeywordChange(subcategory)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  localserviceData.keywords.includes(subcategory)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {subcategory}
              </button>
            ))}
          </div>
          <small className="text-gray-500 block mt-1">
            Select relevant keywords to help buyers find your service.
          </small>
        </div>

        {/* Short Description */}
        <div className="col-span-2">
          <label className="block text-lg font-semibold text-gray-700">Short Description</label>
          <textarea
            placeholder="Write a compelling one-liner describing your service..."
            value={localserviceData.shortDescription}
            onChange={(e) => handleChange("shortDescription", e.target.value)}
            className="mt-2 block w-full border rounded-lg shadow-sm px-4 py-3 h-20 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <small className="text-gray-500 block mt-1">
            Describe your service in 150 characters or less.
          </small>
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Why Choose This Category?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FaCode, color: "text-blue-500", title: "Web Development", description: "Craft high-quality websites and web apps." },
          { icon: FaPaintBrush, color: "text-green-500", title: "Graphic Design", description: "Create stunning visuals and branding materials." },
          { icon: FaPenNib, color: "text-purple-500", title: "Content Writing", description: "Deliver captivating and error-free content." },
          { icon: FaVideo, color: "text-red-500", title: "Video Editing", description: "Edit professional-grade videos effortlessly." },
          { icon: FaMicrophone, color: "text-yellow-500", title: "Voice Over", description: "Record crisp, clear, and engaging audio." },
          { icon: FaChartBar, color: "text-orange-500", title: "SEO and Marketing", description: "Boost visibility with expert SEO services." },
        ].map((feature, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-md hover:shadow-lg"
          >
            <feature.icon className={`${feature.color} text-2xl`} />
            <div>
              <h4 className="font-semibold text-lg text-gray-700">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;
