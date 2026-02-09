"use client";
import { Mail } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
const ForgotPassword = () => {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold text-[#1b9c5e]">
            Forgot Password?
          </h1>
          <p className="mt-2 text-gray-500">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        <form className="mt-8 space-y-6">
          {/* Email Address */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#1b9c5e]"
            >
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your.email@example.com"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b9c5e] focus:border-[#1b9c5e] outline-none transition-colors sm:text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Link
            href="/check-mail"
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#1F8A5B] hover:bg-[#157a49] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            Send Reset Link
          </Link>
        </form>

        <div>
          <Link
            href="/login"
            type="submit"
            className="w-full flex items-center justify-center gap-2  text-[#475569]"
          >
            <FaArrowLeft /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
