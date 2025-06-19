"use client";
import React, { useContext, useState } from "react";
import { FiClock, FiRefreshCcw } from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GlobalContext } from "@/context";
import { toast, Toaster } from "sonner";

function Pricing({ serviceData }) {
  const { data, status } = useSession();
  const router = useRouter();
  const { setCurrentUpdatedservice } = useContext(GlobalContext);
  const [selectedPricing, setSelectedPricing] = useState("basic");

  const sessionUser = data ? data : null;
  const userId = sessionUser?.user?.userId;

  if (!serviceData) return null;

  const pricing = serviceData.pricing;

  const renderPricingDetails = (tier) => {
    const pricingTier = pricing[tier];

    if (!pricingTier) return null;

    return (
      <div className="border-t pt-20">
        <div className="flex flex-wrap justify-between">
          <h4 className="text-sm md:text-md font-normal text-gray-700">{serviceData.shortDesc}</h4>
          <h6 className="font-medium text-sm md:text-lg text-blue-600">${pricingTier.price}</h6>
        </div>
        <Toaster />
        <div className="text-gray-700 font-semibold text-xs md:text-sm flex flex-wrap gap-3 md:gap-6 mt-2">
          <div className="flex items-center gap-2">
            <FiClock className="text-lg md:text-xl text-blue-600" />
            <span>{pricingTier.time} Days Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <FiRefreshCcw className="text-lg md:text-xl text-blue-600" />
            <span>{pricingTier.revisions} Revisions</span>
          </div>
        </div>
        <ul className="flex flex-col gap-2 mt-3">
          {pricingTier.features?.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 md:gap-3">
              <div className="relative">
                <BsCheckLg className="text-blue-600 text-md md:text-lg" />
                <span className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></span>
              </div>
              <span className="text-sm md:text-md text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-4 md:px-6 font-semibold text-sm md:text-lg rounded-md shadow-md transition-all duration-300 transform hover:scale-105 mt-4"
          onClick={() => {
            if (!sessionUser) {
              toast.error("Login first");
            } else {
              if (serviceData.userId._id === userId) {
                setCurrentUpdatedservice(serviceData);
                router.push("/projects/create");
              } else {
                router.push(`/checkout?projectId=${serviceData._id}&pricing=${tier}`);
              }
            }
          }}
        >
          {serviceData.userId._id === userId ? "Edit" : "Proceed"}
        </button>
      </div>
    );
  };

  return (
    <div className="mb-10 w-full bg-white p-6 rounded-lg shadow-md font-roboto">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        .font-roboto {
          font-family: 'Roboto', sans-serif;
        }
        .pricing-card {
          opacity: 0;
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="pricing-card">
        {/* Pricing Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {["basic", "standard", "premium"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedPricing(tier)}
              className={`flex-1 py-2 px-4 text-center text-sm md:text-base font-semibold rounded-full ${
                selectedPricing === tier
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-100"
              } transition-all duration-300`}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>

        {/* Pricing Details */}
        {renderPricingDetails(selectedPricing)}

        {/* Contact Button */}
        {serviceData.userId._id !== userId && (
          <button className="w-full mt-4 bg-white hover:bg-blue-600 border border-blue-600 hover:text-white text-blue-600 py-2 px-4 text-sm md:text-base font-semibold rounded-md transition-all duration-300">
            Contact Seller
          </button>
        )}
      </div>
    </div>
  );
}

export default Pricing;
