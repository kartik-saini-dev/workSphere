

"use client";

import { useState, useEffect } from "react";
import { FaShoppingCart, FaCreditCard } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"; // need this to use searchparams or can call checkout component paste all the code without suspense in component and import here 

const stripePromise = loadStripe("pk_test_...."); //your stripe publishable key 

function CheckoutComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

const serviceId = searchParams.get("serviceId") || searchParams.get("projectId");

  const tier = searchParams.get("pricing");

  const { data, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const sessionUser = data ? data : null;
  const { user: { userId } = {} } = sessionUser || {};

  const handleCheckout = async () => {
    setIsLoading(true);
    const stripe = await stripePromise;
    const response = await fetch(`/api/orders/post?buyerId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-cache",
      body: JSON.stringify({ serviceId, pricingTier: tier }),
    });

    if (!response.ok) {
      console.error("Failed to create order:", response.statusText);
      setIsLoading(false);
      return;
    }

    const data = await response.json();

    if (data.sessionId && stripe) {
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      console.error("Stripe initialization or sessionId error.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg max-w-2xl p-8 flex flex-col items-center gap-6">
        <div className="text-green-600 text-6xl">
          <FaShoppingCart />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Ready to Place Your Order?
        </h1>
        <p className="text-gray-600 text-center">
          Please complete the payment to secure your order and start the process.
        </p>
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-md transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          <FaCreditCard className="text-xl" />
          <span className="text-lg font-semibold">
            {isLoading ? "Proceeding..." : "Proceed to Checkout"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutComponent />
    </Suspense>
  );
}
