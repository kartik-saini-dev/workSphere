"use client";

import { FaDollarSign } from "react-icons/fa";
import { useContext } from "react";
import { GlobalContext } from "@/context"; // Adjust the import path as needed

const PricingTab = () => {
  const { serviceData, updatePricing } = useContext(GlobalContext);

  const handleFeatureChange = (packageType, index, value) => {
    const updatedFeatures = [...serviceData.pricing[packageType].features];
    updatedFeatures[index] = value;
    updatePricing(packageType, "features", updatedFeatures);
  };

  const addFeatureInput = (packageType) => {
    const updatedFeatures = [...serviceData.pricing[packageType].features, ""];
    updatePricing(packageType, "features", updatedFeatures);
  };

  const handleInputChange = (packageType, field, value) => {
    updatePricing(packageType, field, value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <FaDollarSign className="text-green-500 text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">Pricing</h2>
      </div>
      <p className="text-gray-600 mb-6 text-lg">
        Define a competitive pricing structure for your service. Differentiate your packages with clear deliverables, revisions, benefits, and delivery times.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["basic", "standard", "premium"].map((packageType) => {
          const packageData = serviceData.pricing[packageType];
          return (
            <div
              key={packageType}
              className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-3 capitalize">
                {packageType} Package
              </h3>
              {/* Price Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={packageData.price}
                  onChange={(e) =>
                    handleInputChange(packageType, "price", e.target.value)
                  }
                  placeholder={`e.g., ${
                    packageType === "basic" ? 50 : packageType === "standard" ? 100 : 150
                  }`}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              {/* Revisions Input */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Revisions
                </label>
                <input
                  type="number"
                  value={packageData.revisions}
                  onChange={(e) =>
                    handleInputChange(packageType, "revisions", e.target.value)
                  }
                  placeholder="e.g., 2"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              {/* Features List */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Features
                </label>
                {packageData.features.map((feature, featureIndex) => (
                  <input
                    key={featureIndex}
                    type="text"
                    value={feature}
                    onChange={(e) =>
                      handleFeatureChange(packageType, featureIndex, e.target.value)
                    }
                    placeholder={`Feature ${featureIndex + 1} (e.g., Fast Delivery)`}
                    className="w-full mb-2 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addFeatureInput(packageType)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  + Add another feature
                </button>
              </div>
              {/* Delivery Time Input */}
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Delivery Time (Days)
                </label>
                <input
                  type="number"
                  value={packageData.time}
                  onChange={(e) =>
                    handleInputChange(packageType, "time", e.target.value)
                  }
                  placeholder="e.g., 3"
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingTab;
