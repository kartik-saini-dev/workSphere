"use client";
import { useContext, useState } from "react";
import axios from "axios";
import { GlobalContext } from "@/context";
import { toast, Toaster } from "sonner";
import { useSession } from "next-auth/react";
import { FaDollarSign, FaRegListAlt, FaRedo, FaSpinner, FaTag } from "react-icons/fa";

const PublishTab = () => {
  const { serviceData } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  // Function to validate if all required fields are filled
  const isValid = () => {
    return (
      serviceData.title &&
      serviceData.category &&
      serviceData.shortDescription &&
      serviceData.description &&
      // serviceData.images.length > 0 &&
      serviceData.keywords?.length > 0 &&
      (
        (serviceData.pricing.basic.price &&
          serviceData.pricing.basic.revisions &&
          serviceData.pricing.basic.features.length > 0) ||
        (serviceData.pricing.standard.price &&
          serviceData.pricing.standard.revisions &&
          serviceData.pricing.standard.features.length > 0) ||
        (serviceData.pricing.premium.price &&
          serviceData.pricing.premium.revisions &&
          serviceData.pricing.premium.features.length > 0)
      )
    );
  };

  // Function to publish the service
  const handlePublish = async () => {
    if (!isValid()) {
      toast.error("Please fill all required fields before publishing.");
      return;
    }
    if (status === "unauthenticated") {
      toast.error("Please login before publishing.");
      return;
    }
    try {
      setIsLoading(true);
      const finalData = { ...serviceData, userId: session.user.userId };
      const response = await axios.post("/api/services/addServices", finalData);
  
      if (response.data.success) {
        toast.success("service published successfully!");
      } else {
        toast.error("Failed to publish service. Please try again.");
      }
    } catch (error) {
      console.error("Error publishing service:", error);
      toast.error("Failed to publish service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Toaster richColors />
      <h2 className="text-3xl font-semibold text-gray-900 mb-6">Publish Your service</h2>
      <p className="text-lg text-gray-600 mb-6">
        Review your service details, ensure all information is correct, and publish it to start receiving orders.
      </p>

      <div className="grid grid-cols-1 gap-6">
        {/* service Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">service Summary</h3>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-center">
              <FaRegListAlt className="text-blue-600 mr-3" />
              <strong>Title:</strong> {serviceData.title || "Not specified"}
            </li>
            <li className="flex items-center">
              <FaRegListAlt className="text-blue-600 mr-3" />
              <strong>Category:</strong> {serviceData.category || "Not specified"}
            </li>
            <li className="flex items-center">
              <FaRegListAlt className="text-blue-600 mr-3" />
              <strong>Description:</strong> {serviceData.shortDescription || "Not specified"}
            </li>
            <li className="flex items-center">
              <FaTag className="text-blue-600 mr-3" />
              <strong>Keywords:</strong> {serviceData.keywords?.join(", ") || "None"}
            </li>
            <li className="flex items-center">
              <FaDollarSign className="text-blue-600 mr-3" />
              <strong>Pricing:</strong> 
              Basic: ${serviceData.pricing.basic.price || "0"} - 
              Standard: ${serviceData.pricing.standard.price || "0"} - 
              Premium: ${serviceData.pricing.premium.price || "0"}
            </li>
            <li className="space-y-2">
              <strong>Features:</strong>
              <ul className="pl-6 list-disc space-y-1">
                <li><strong>Basic:</strong> {serviceData.pricing.basic.features.join(", ") || "None"}</li>
                <li><strong>Standard:</strong> {serviceData.pricing.standard.features.join(", ") || "None"}</li>
                <li><strong>Premium:</strong> {serviceData.pricing.premium.features.join(", ") || "None"}</li>
              </ul>
            </li>
            <li className="space-y-2">
              <strong>Revisions:</strong>
              <ul className="pl-6 list-disc space-y-1">
                <li><strong>Basic:</strong> {serviceData.pricing.basic.revisions || "0"}</li>
                <li><strong>Standard:</strong> {serviceData.pricing.standard.revisions || "0"}</li>
                <li><strong>Premium:</strong> {serviceData.pricing.premium.revisions || "0"}</li>
              </ul>
            </li>
            <li className="space-y-2">
              <strong>Delivery Time:</strong>
              <ul className="pl-6 list-disc space-y-1">
                <li><strong>Basic:</strong> {serviceData.pricing.basic.time || "0"} days</li>
                <li><strong>Standard:</strong> {serviceData.pricing.standard.time || "0"} days</li>
                <li><strong>Premium:</strong> {serviceData.pricing.premium.time || "0"} days</li>
              </ul>
            </li>
          </ul>
        </div>

        {/* Publish Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm and Publish</h3>
          <button
            onClick={handlePublish}
            className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              "Publish service"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishTab;
