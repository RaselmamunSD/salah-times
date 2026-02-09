"use client";
import { ArrowRight, Eye, EyeOffIcon, Lock, Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 lg:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1b9c5e]">Sign In</h1>
          <p className="mt-2 text-gray-500">
            Login to your Salaah-Times account
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

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#1b9c5e]"
            >
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b9c5e] focus:border-[#1b9c5e] outline-none transition-colors sm:text-sm placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ?
                  <EyeOffIcon size={18} />
                : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-right text-sm text-gray-600">
            <Link
              href="#"
              className="text-[#1F8A5B] hover:text-[#157a49] decoration-1 underline-offset-2"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#1F8A5B] hover:bg-[#157a49] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
        <div className="flex justify-center items-center gap-24">
          <div className="h-px w-[120px] border border-[#E2E8F0]"></div>
          <p className="text-center text-[#475569]">Or</p>
          <div className="h-px w-[120px] border border-[#E2E8F0]"></div>
        </div>
        <div>
          <Link
            href="/register"
            type="submit"
            className="w-full flex items-center justify-center gap-2 border-2 border-[#1F8A5B] hover:bg-[#157a49] hover:text-white text-[#1b9c5e] py-3 px-4 rounded-lg transition duration-200 ease-in-out hover:shadow-lg"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
