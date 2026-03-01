"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import authService from "@/app/services/auth";

const ResetPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const isLinkValid = Boolean(uid && token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!isLinkValid) {
            setError("Invalid or missing reset link. Please request a new one.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields.");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword({
                uid,
                token,
                new_password: newPassword,
                new_password_confirm: confirmPassword,
            });

            setSuccess("Password reset successful. Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 1200);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                "Reset link is invalid or expired. Please request a new reset email."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 md:p-16">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-[#1b9c5e]">Reset Password</h1>
                    <p className="mt-2 text-gray-500">
                        Enter your new password to complete the reset process.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                        {success}
                    </div>
                )}

                {!isLinkValid && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                        Reset link is missing required information (uid/token).
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1b9c5e]">New Password *</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b9c5e] focus:border-[#1b9c5e] outline-none transition-colors sm:text-sm placeholder:text-gray-400"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1b9c5e]">Confirm New Password *</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1b9c5e] focus:border-[#1b9c5e] outline-none transition-colors sm:text-sm placeholder:text-gray-400"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isLinkValid}
                        className="w-full flex items-center justify-center gap-2 bg-[#1F8A5B] hover:bg-[#157a49] disabled:bg-[#1F8A5B]/60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordPage;
