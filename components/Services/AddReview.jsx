

// "use client";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";
// import { FaStar } from "react-icons/fa";
// import { useSession } from "next-auth/react";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";

// function AddReview({ ownerOfservice, serviceId }) {
//   const [reviewData, setReviewData] = useState({ reviewText: "", rating: 0 });
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();
//   const { data, status } = useSession();
//   const sessionUser = data ? data : null;
//   const { user: { userId } } = sessionUser || {};

//   const addReview = async () => {
//     if (!reviewData.rating || !reviewData.reviewText) {
//       alert("Please provide both a rating and a review text.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const { data: response } = await axios.post(
//         `/api/reviews?serviceId=${serviceId}&reviewerId=${userId}`,
//         { ...reviewData },
//       );

//       if (response.success) {
//         setReviewData({ reviewText: "", rating: 0 });
//         router.refresh(); // Replace with mutate for improved revalidation
//       }
//     } catch (err) {
//       console.error("Error adding review:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mb-10">
//       <h3 className="text-2xl my-5 font-semibold text-[#404145]">
//         Leave a Review for <span className="text-[#1DBF73]">{ownerOfservice}</span>
//       </h3>

//       <div className="flex flex-col items-start gap-4 w-full max-w-md sm:max-w-lg mx-auto">
//         <textarea
//           name="reviewText"
//           id="reviewText"
//           onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
//           value={reviewData.reviewText}
//           className="block p-3 w-full text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-[#1DBF73] focus:border-[#1DBF73] resize-none"
//           rows={4}
//           placeholder="Write your review here..."
//         ></textarea>

//         <div className="flex gap-2">
//           {[1, 2, 3, 4, 5].map((num) => (
//             <FaStar
//               key={num}
//               className={`text-2xl cursor-pointer transition-all duration-200 ${
//                 reviewData.rating >= num ? "text-yellow-400" : "text-gray-300"
//               }`}
//               onClick={() => setReviewData({ ...reviewData, rating: num })}
//             />
//           ))}
//         </div>

//         <button
//           className="flex items-center justify-center bg-[#1DBF73] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#17a864] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={addReview}
//           disabled={loading}
//         >
//           {loading ? (
//             <AiOutlineLoading3Quarters className="animate-spin text-lg mr-2" />
//           ) : (
//             "Add Review"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default AddReview;

"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import DOMPurify from "dompurify"; // Import DOMPurify
import { toast } from "sonner"; // Import toast from Sonner

function AddReview({ ownerOfservice, serviceId }) {
  const [reviewData, setReviewData] = useState({ reviewText: "", rating: 0 });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { data, status } = useSession();
  const sessionUser = data ? data : null;
  const { user: { userId } } = sessionUser || {};

  const addReview = async () => {
    if (!reviewData.rating || !reviewData.reviewText) {
      toast.error("Please provide both a rating and a review text.");
      return;
    }

    try {
      setLoading(true);

      // Sanitize user input
      const sanitizedReviewText = DOMPurify.sanitize(reviewData.reviewText);

      const { data: response } = await axios.post(
        `/api/reviews?serviceId=${serviceId}&reviewerId=${userId}`,
        { ...reviewData, reviewText: sanitizedReviewText } // Use sanitized text
      );

      if (response.success) {
        setReviewData({ reviewText: "", rating: 0 });
        toast.success("Review added successfully!");
        router.refresh(); // Refresh the page or data
      } else {
        toast.error("Failed to add the review. Please try again.");
      }
    } catch (err) {
      console.error("Error adding review:", err);
      toast.error("An error occurred while adding the review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h3 className="text-2xl my-5 font-semibold text-[#404145]">
        Leave a Review for <span className="text-[#1DBF73]">{ownerOfservice}</span>
      </h3>

      <div className="flex flex-col items-start gap-4 w-full max-w-md sm:max-w-lg mx-auto">
        <textarea
          name="reviewText"
          id="reviewText"
          onChange={(e) =>
            setReviewData({ ...reviewData, reviewText: e.target.value })
          }
          value={reviewData.reviewText}
          className="block p-3 w-full text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-[#1DBF73] focus:border-[#1DBF73] resize-none"
          rows={4}
          placeholder="Write your review here..."
        ></textarea>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`text-2xl cursor-pointer transition-all duration-200 ${
                reviewData.rating >= num ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setReviewData({ ...reviewData, rating: num })}
            />
          ))}
        </div>

        <button
          className="flex items-center justify-center bg-[#1DBF73] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#17a864] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={addReview}
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-lg mr-2" />
          ) : (
            "Add Review"
          )}
        </button>
      </div>
    </div>
  );
}

export default AddReview;
