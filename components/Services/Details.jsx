"use client";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Reviews from "./Reviews";
import { FaStar, FaCommentAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatBox from "./chatUser";
import { GlobalContext } from "@/context";
import { useContext } from "react";
import ComponentLevelLoader from "../Loader/componentLevelLoader";
import AddReview from "./AddReview";
import { toast } from "sonner";

function Details({ serviceData }) {
  const [currentImage, setCurrentImage] = useState("");
  const [hasOrdered, setHasOrdered] = useState(false);
  const { data, status } = useSession();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { setPageLevelLoader } = useContext(GlobalContext);


  const router = useRouter();


  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  useEffect(() => {
    if (status === "authenticated") {
      try {
        const fetchOrder = async (serviceId, userId) => {
          const { data: order } = await axios.get(`/api/orders?serviceId=${serviceId}&userId=${userId}`);

          if (order.success) {
            setHasOrdered(true);
          } else {
            setHasOrdered(false);
          }
        };

        const { user: { userId } } = data || {};
        if (userId) {
          fetchOrder(serviceData._id, userId);
        }
      } catch (err) {
        // console.log(err);
      }
    }
  }, [status, data]);

  useEffect(() => {
    if (serviceData) {
      setCurrentImage(serviceData.images[0]);
    }
  }, [serviceData]);

  const [averageRatings, setAverageRatings] = useState("0");

  useEffect(() => {
    if (serviceData && serviceData.reviews.length) {
      let avgRating = 0;
      serviceData.reviews.forEach(({ rating }) => (avgRating += rating));
      setAverageRatings((avgRating / serviceData.reviews.length).toFixed(1));
    }
  }, [serviceData]);

  if (status === 'loading') {
    return <ComponentLevelLoader text="serviceLoading..." color="text-red-500" size="w-12 h-12" />;
  }

  const handleClick = () => {
    if (status === "unauthenticated") {
      toast.error("Login first"); // Show toast error if status is unauthenticated
      return null; // Or return any other component if you don't want anything else to render
    }
    setIsChatOpen(true)
  }



  // const sessionUser = data ? data : null;
  // const { user: { userId: purchasedUserId } } = sessionUser || {};

  return (
    <>
      {serviceData && currentImage !== "" && (
        <div className="col-span-2 flex flex-col gap-6 px-4 sm:px-8 lg:px-16 pt-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#404145] mb-4">
            {serviceData.title}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              {serviceData?.userId?.profilePic ? (
                <Image
                  src={serviceData?.userId?.profilePic}
                  alt="profile"
                  height={40}
                  width={40}
                  className="rounded-full"
                />
              ) : (
                <div className="bg-purple-500 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full">
                  <span className="text-sm sm:text-xl text-white">
                    {serviceData?.userId?.email[0].toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <h4 className="text-base sm:text-lg font-medium">{serviceData?.userId?.fullName}</h4>
                <h6 className="text-gray-500 text-sm">@{serviceData?.userId?.username}</h6>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${Math.ceil(averageRatings) >= star ? "text-yellow-500" : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="text-yellow-500 text-sm sm:text-base">{averageRatings}</span>
              <span className="text-gray-600 text-sm sm:text-base">
                ({serviceData?.reviews?.length} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="max-h-[400px] sm:max-h-[600px] lg:max-h-[800px] overflow-hidden">
              <img
                src={currentImage}
                alt="service"
                className="w-full h-auto hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              {serviceData?.images?.length > 1 &&
                serviceData.images.map((image) => (
                  <img
                    src={image}
                    alt="service"
                    height={80}
                    width={80}
                    key={image}
                    onClick={() => setCurrentImage(image)}
                    className={`${currentImage === image ? "" : "blur-sm"
                      } cursor-pointer transition-all duration-500`}
                  />
                ))}
            </div>
          </div>
          {serviceData?.videoURL && (
            <div className="my-6">
              <h3 className="text-lg sm:text-2xl font-medium text-[#404145] mb-4">service Video</h3>
              <video
                controls
                className="w-full max-h-[400px] sm:max-h-[600px] lg:max-h-[800px] rounded-md"
              >
                <source src={serviceData.videoURL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg sm:text-2xl font-medium text-[#404145] mb-4">
              About this service
            </h3>
            <p className="text-sm sm:text-base">{serviceData.description}</p>
          </div>

          <div className="requirements-section">
            <h3 className="text-lg sm:text-2xl my-5 font-medium text-[#404145]">Requirements</h3>
            <ul className="text-sm sm:text-base">
              {serviceData.requirements && serviceData.requirements.length > 0 ? (
                serviceData.requirements.map((item) => (
                  <li key={item._id} className="mb-2">
                    <p>
                      <strong>Question:</strong> {item.question}
                    </p>
                    <p>
                      <strong>Type:</strong> {item.type}
                    </p>
                  </li>
                ))
              ) : (
                <p>No requirements listed.</p>
              )}
            </ul>
          </div>

          <div className="sales-section">
            <h3 className="text-lg sm:text-2xl my-5 font-medium text-[#404145]">Sales & Ratings</h3>
            {serviceData.sales ? (
              <>
                <p className="text-sm sm:text-base">
                  <strong>Total Sales:</strong> {serviceData.sales.totalSales}
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Total Reviews:</strong> {serviceData.sales.totalReviews}
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`cursor-pointer ${Math.ceil(serviceData.sales.rating) >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-500 text-sm sm:text-base">{serviceData.sales.rating}</span>
                </div>
              </>
            ) : (
              <p>No sales data available.</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg sm:text-2xl font-medium text-[#404145] mb-4">
            Meet the Seller
            </h3>
            <div className="flex gap-4">
              <div>
                {serviceData?.userId?.profilePic ? (
                  <Image
                    src={serviceData.userId.profilePic}
                    alt="Seller Profile"
                    height={100}
                    width={100}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
                    <span className="text-sm sm:text-xl text-white">
                      {serviceData?.userId?.email[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 text-sm sm:text-base">
                <h4 className="text-base sm:text-lg font-medium">
                  {serviceData?.userId?.fullName}
                </h4>
                <span className="text-gray-500">@{serviceData?.userId?.username}</span>
                <p>{serviceData?.userId?.description}</p>
              </div>
            </div>
          </div>

          <Reviews serviceData={serviceData} />
          {hasOrdered && <AddReview serviceId={serviceData._id} ownerOfservice={serviceData?.userId?.username} />}
          <div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center gap-2 cursor-pointer hover:bg-[blue] transition-all duration-300"
            onClick={handleClick}
          >
             <Toaster /> 
            <FaCommentAlt />
            <span className="hidden sm:inline">Message Seller</span>
          </div>

          {isChatOpen && (
            <ChatBox
              username={serviceData?.userId?.username}
              onClose={() => setIsChatOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Details;
