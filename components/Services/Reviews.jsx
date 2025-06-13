"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { Toast,Toastigfy } from "sonner";
function Reviews({ serviceData, onDeleteReview }) {
  const { data: session } = useSession();
  const [averageRatings, setAverageRatings] = useState("0");
const router = useRouter();
  useEffect(() => {
    if (serviceData && serviceData.reviews.length) {
      let avgRating = 0;
      serviceData.reviews.forEach(({ rating }) => (avgRating += rating));
      setAverageRatings((avgRating / serviceData.reviews.length).toFixed(1));
    }
  }, [serviceData]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const {data : res} = await axios.delete(`/api/reviews/delete/?reviewId=${reviewId}&serviceId=${serviceData._id}`,);
      if (res.success) {
        router.refresh();
        alert("Review deleted successfully!");
        // Optionally refetch or update reviews
      } else {
        alert("Failed to delete review.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    }
  };
  return (
    <>
      {serviceData && (
        <div className="mb-10">
          <h3 className="text-3xl font-semibold text-gray-800 my-5">Reviews</h3>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-5 gap-3">
            <h5 className="text-lg text-gray-600">
              {serviceData.reviews.length} reviews for this service
            </h5>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-lg ${
                      Math.ceil(averageRatings) >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium text-gray-700">
                {averageRatings}
              </span>
            </div>
          </div>

          <div className="grid gap-6">
            {serviceData.reviews.map((review) => (
              <div
                className="flex flex-col md:flex-row gap-4 border-t pt-6"
                key={review._id}
              >
                <div className="flex-shrink-0">
                  {review.reviewer.profileImage ? (
                    <img
                      src={review.reviewer.profileImage}
                      alt="Profile"
                      className="rounded-full w-14 h-14 object-cover"
                    />
                  ) : (
                    <div className="bg-purple-500 h-14 w-14 flex items-center justify-center rounded-full">
                      <span className="text-xl text-white font-bold">
                        {review.reviewer.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow gap-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-800">
                      {review.reviewer.username}
                    </h4>
                    {session?.user.userId === review.reviewer._id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="Delete Review"
                      >
                        <FaTrash className="text-xl" />
                      </button>
                    )}
                  </div>
                  <div className="flex text-yellow-500 items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-lg ${
                            review.rating >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Reviews;
