"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import Notification from "@/components/Notification";
import { loginFormControls } from "@/utilis/index";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const initialFormdata = {
  email: "",
  password: "",
};

export default function Login() {
  const { data } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormdata);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();

  function isValidForm() {
    return formData.email.trim() !== "" && formData.password.trim() !== "";
  }

  async function handleLogin() {
    setLoading(true);
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (!res?.ok) {
      toast.error("Login unsuccessful!", { position: toast.POSITION.TOP_RIGHT });
    } else {
      toast.success("Login successful!", { position: toast.POSITION.TOP_RIGHT });
      router.push("/");
    }
    setLoading(false);
  }

  function handleForgotPasswordClick() {
    setShowForgotPassword(true);
  }

  async function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/forgotPassword", { email: formData.email });
      toast.success(res.data.message || "Password reset link sent!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      toast.error("Error sending reset link. Try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-blue-500 w-1/2 text-white p-10">
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg">Log in to continue accessing your account and managing your tasks.</p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800">
              {showForgotPassword ? "Forgot Password" : "Login"}
            </h2>
            <p className="text-gray-500">
              {showForgotPassword
                ? "Enter your email to reset your password"
                : "Enter your credentials to continue"}
            </p>
          </div>

          {/* Conditionally Render Forms */}
          {!showForgotPassword ? (
            <div className="space-y-6">
              {loginFormControls.map((controlItem, index) =>
                controlItem.componentType === "input" ? (
                  <InputComponent
                    key={index}
                    type={controlItem.type}
                    placeholder={controlItem.placeholder}
                    label={controlItem.label}
                    value={formData[controlItem.id]}
                    onChange={(event) => {
                      setFormData({ ...formData, [controlItem.id]: event.target.value });
                    }}
                  />
                ) : null
              )}

              <button
                className={`w-full py-3 text-white rounded-lg font-bold transition duration-300 ${
                  isValidForm() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isValidForm() || loading}
                onClick={handleLogin}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center">
                <button
                  className="text-blue-600 hover:text-blue-700 transition duration-200"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <InputComponent
                type="email"
                placeholder="Enter your email"
                label="Reset Email"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition duration-300"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* Footer */}
          {!showForgotPassword && (
            <div className="text-center mt-8">
              <p className="text-gray-500">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-600 hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
      <Notification />
    </div>
  );
}