// "use client";

// import axios from "axios";
// import { useRouter ,useSearchParams} from "next/navigation";
// import React, { useEffect ,useState} from "react";
// import { FaCheckCircle } from "react-icons/fa";

// function Success() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [orderId, setOrderId] = useState(null);
//   const sessionId = searchParams.get("session_id");
      

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         // Fetch session details from your server
//         const { data } = await axios.put(`/api/stripe/session/?sessionId=${sessionId}`);
//         setOrderId(data.orderId); // Extract order ID from metadata
//       } catch (err) {
//         console.error("Error fetching session details:", err);
//       }
//     };

//     if (sessionId) fetchOrderDetails();

//     // Redirect after 5 seconds
//     const timeout = setTimeout(() => {
//       if (orderId) router.push(`/buyer/orders`);
//     }, 5000);

//     return () => clearTimeout(timeout);
//   }, [sessionId, orderId, router]);


//   return (
//     <div className="h-[80vh] flex flex-col items-center justify-center px-5 lg:px-20 bg-gray-50">
//       <div className="text-green-500 text-6xl mb-6">
//         <FaCheckCircle />
//       </div>
//       <h1 className="text-2xl lg:text-4xl font-semibold text-center text-gray-800">
//         Payment Successful!
//       </h1>
//       <p className="text-lg lg:text-xl text-center text-gray-600 mt-4">
//         You are being redirected to the orders page.
//       </p>
//       <p className="text-lg lg:text-xl text-center text-gray-600">
//         Please do not close this page.
//       </p>
//     </div>
//   );
// }

// export default Success;

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useSearchParams } from "next/navigation";

function SuccessComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch session details from your server
        const { data } = await axios.put(`/api/stripe/session/?sessionId=${sessionId}`);
        setOrderId(data.orderId); // Extract order ID from metadata
      } catch (err) {
        console.error("Error fetching session details:", err);
      }
    };

    if (sessionId) fetchOrderDetails();

    // Redirect after 5 seconds
    const timeout = setTimeout(() => {
      if (orderId) router.push(`/buyer/orders`);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [sessionId, orderId, router]);

  return (
    <div className="h-[80vh] flex flex-col items-center justify-center px-5 lg:px-20 bg-gray-50">
      <div className="text-green-500 text-6xl mb-6">
        <FaCheckCircle />
      </div>
      <h1 className="text-2xl lg:text-4xl font-semibold text-center text-gray-800">
        Payment Successful!
      </h1>
      <p className="text-lg lg:text-xl text-center text-gray-600 mt-4">
        You are being redirected to the orders page.
      </p>
      <p className="text-lg lg:text-xl text-center text-gray-600">
        Please do not close this page.
      </p>
    </div>
  );
}

export default function Success() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <SuccessComponent />
    </React.Suspense>
  );
}

