"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import authService from "@/app/services/auth";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setSuccess("If an account exists with this email, a reset link has been sent.");
      // Redirect to check-mail page after a short delay
      setTimeout(() => {
        router.push("/check-mail");
      }, 800);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 md:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#1b9c5e]">
            Forgot Password?
          </h1>
          <p className="mt-2 text-gray-500">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b9c5e] focus:border-[#1b9c5e] outline-none transition-colors sm:text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1F8A5B] hover:bg-[#157a49] disabled:bg-[#1F8A5B]/60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div>
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 text-[#475569]"
          >
            <FaArrowLeft /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
