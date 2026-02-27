"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await login({ email, password });

      if (result.success) {
        // Redirect to dashboard or return URL
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 md:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1b9c5e]">Sign In</h1>
          <p className="mt-2 text-gray-500">
            Login to your Salaah-Times account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-right text-sm text-gray-600">
            <Link
              href="/forgot-password"
              className="text-[#1F8A5B] hover:text-[#157a49] decoration-1 underline-offset-2"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1F8A5B] hover:bg-[#157a49] disabled:bg-[#1F8A5B]/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
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

export default LoginPage;

