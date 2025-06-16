"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

export default function Join({ onClose = () => {} }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-lg flex max-w-3xl w-full h-[600px]">
            {/* Left Section: Image */}
            <div className="hidden md:block w-1/2 relative">
              <Image
                src="/code.jpg"
                alt="Authentication Illustration"
                fill
                className="object-cover rounded-l-lg"
                priority
              />
            </div>

            {/* Right Section: Content */}
            <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-center">
              {/* Close button */}
              <span
                className="absolute top-2 right-2 cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={closeModal}
              >
                <AiOutlineClose size={24} />
              </span>

              <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Welcome Back!
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Sign in to access your account and explore more features.
              </p>

              {/* Sign-In Buttons */}
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200"
                >
                  <FcGoogle size={24} className="mr-2" />
                  Sign in with Google
                </button>
                <button
                  type="button"
                  onClick={() => signIn("github")}
                  className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-200"
                >
                  <FaGithub size={24} className="mr-2 text-black" />
                  Sign in with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-3 text-gray-500 text-sm">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Login and Register Options */}
              <button
                type="button"
                onClick={() => router.push("/signIn")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-5 py-2.5 text-center"
              >
                Login to your account
              </button>

              <div className="text-sm font-medium text-center text-gray-600 mt-4">
                New here?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
