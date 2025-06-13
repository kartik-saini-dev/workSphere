
"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa";

function UnauthorizedPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/signIn"); // Redirect to your login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm sm:max-w-md">
        <FaLock className="text-red-500 text-5xl mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          You need to log in to access this page. Please log in to continue.
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-[#1DBF73] text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-[#17a864] transition-all duration-200"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
