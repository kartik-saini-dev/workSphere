
"use client";

import { useState ,useContext,useEffect} from "react";
import { useSession } from "next-auth/react";
import { FiArrowRightCircle } from "react-icons/fi";
import OverviewTab from "@/components/createService/OverviewTab";
import PricingTab from "@/components/createService/PricingTab";
import RequirementsTab from "@/components/createService/RequirementTab";
import PublishTab from "@/components/createService/PublishTab";
import GalleryTab from "@/components/createService/GalleryTab";
import DescriptionTab from "@/components/createService/DescriptionTab";
import { GlobalContext } from "@/context";


const TABS = [
  { id: 1, name: "Overview", icon: "📝" },
  { id: 2, name: "Pricing", icon: "💲" },
  { id: 3, name: "Description", icon: "✍️" },
  { id: 4, name: "Requirements", icon: "📋" },
  { id: 5, name: "Gallery", icon: "🖼️" },
  { id: 6, name: "Publish", icon: "🚀" },
];

const Createservice = () => {
  const [activeTab, setActiveTab] = useState(1); // Track active tab
  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const switchTab = (id) => setActiveTab(id);

  
  const { setPageLevelLoader, } = useContext(GlobalContext);


  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Create a Service
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Follow the steps below to craft the perfect service.
        </p>

        {/* Navigation Tabs */}
        <div className="flex justify-around mb-6">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex flex-col items-center cursor-pointer ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-400"
              }`}
            >
              <div className="text-3xl">{tab.icon}</div>
              <span className="text-sm font-medium">{tab.name}</span>
            </div>
          ))}
        </div>
        <div className="relative w-full bg-gray-200 h-2 rounded mt-4 mb-6">
  <div
    className="absolute top-0 left-0 h-2 bg-blue-500 rounded"
    style={{ width: `${(activeTab / TABS.length) * 100}%` }}
  />
</div>
        {/* Tab Content */}
        <div className="bg-white p-6 rounded shadow">
          {activeTab === 1 && <OverviewTab />}
          {activeTab === 2 && <PricingTab />}
          {activeTab === 3 && <DescriptionTab />}
          {activeTab === 4 && <RequirementsTab />}
          {activeTab === 5 && <GalleryTab />}
          {activeTab === 6 && <PublishTab />}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setActiveTab((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300"
            disabled={activeTab === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setActiveTab((prev) => Math.min(prev + 1, TABS.length))}
            className={`px-4 py-2 rounded ${
              activeTab === TABS.length
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={activeTab === TABS.length}
          >
            Next <FiArrowRightCircle className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Createservice;
