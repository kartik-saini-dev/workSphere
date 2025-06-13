"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaStar, FaDollarSign } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styling
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/context";
import PageLevelLoader from "../Loader";

function SearchGridItem({ service }) {
  const router = useRouter();
  const { pageLevelLoader, setPageLevelLoader, } = useContext(GlobalContext);


  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);



  const calculateRatings = () => {
    const { reviews } = service;
    let rating = 0;
    if (!reviews?.length) {
      return 0;
    }
    reviews.forEach((review) => {
      rating += review.rating;
    });
    return (rating / reviews.length).toFixed(1);
  };
  const handleClick = () => {
    setPageLevelLoader(true); // Show loader on click
    router.push(`/service/${service._id}`);
  };
  return (

    <>
      {pageLevelLoader && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
          <PageLevelLoader />
        </div>
      )}

      <div
        className="group max-w-[320px] flex flex-col gap-4 p-4 cursor-pointer border rounded-lg shadow-lg hover:shadow-2xl transition-shadow mb-8"
        onClick={handleClick}
      >
        {/* Carousel for service Images */}
        <div className="relative w-full h-48">
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            renderArrowPrev={(onClickHandler, hasPrev) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click
                    onClickHandler();
                  }}
                  className="absolute top-1/2 left-4 transition duration-1000 ease-in-out transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ❮
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext) =>
              hasNext && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent click
                    onClickHandler();
                  }}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ❯
                </button>
              )
            }
          >
            {service.images?.map((img, idx) => (
              <div key={idx} className="relative w-full h-48">
                <Image
                  src={img}
                  alt={`service-image-${idx}`}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )) || (
                <div className="relative w-full h-48">
                  <Image
                    src="/service7.jpeg"
                    alt="service-placeholder"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
          </Carousel>
        </div>

        {/* User Profile and Name */}
        <div className="flex items-center gap-3">
          <div>
            {service?.userId?.profilePic ? (
              <Image
                src={service?.userId?.profilePic}
                alt="profile"
                height={40}
                width={40}
                className="rounded-full"
              />
            ) : (
              <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
                <span className="text-lg text-white">
                  {service?.userId?.email[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <span className="text-md font-medium text-gray-800">
            {service?.userId?.username}
          </span>
        </div>

        {/* service Title */}
        <div>
          <p className="line-clamp-2 text-gray-700 font-semibold">{service.title}</p>
        </div>

        {/* Ratings and Reviews */}
        <div className="flex items-center gap-1 text-yellow-500">
          <FaStar />
          <span className="font-medium">{calculateRatings()}</span>
          <span className="text-sm text-gray-500">({service.reviews.length})</span>
        </div>

        {/* Pricing and Delivery */}
        <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <FaDollarSign className="text-green-600" />
            <strong className="font-medium text-gray-800">
              From ${service.pricing["basic"].price}
            </strong>
          </div>
          <div className="flex items-center gap-1">
            <BiTimeFive className="text-blue-600" />
            <span>{service.deliveryTime} days</span>
          </div>
        </div>
      </div>
    </>
  );

}

export default SearchGridItem;
