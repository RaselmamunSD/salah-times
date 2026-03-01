"use client";

import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import mail from "../../../public/icons/mail.png";
import Image from "next/image";

const CheckMail = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your.email@gmail.com";
  const isGmail = email.toLowerCase().endsWith("@gmail.com");
  const inboxUrl = isGmail
    ? "https://mail.google.com/mail/u/0/#inbox"
    : `mailto:${email}`;

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 md:p-16">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="bg-[#1F8A5B] w-16 h-16 rounded-full mx-auto flex justify-center items-center mb-6">
            <Image src={mail} alt="mail icon" width={32} height={32} />
          </div>
          <h1 className="text-[30px] font-semibold text-[#1b9c5e] mb-4">
            Check Your Email
          </h1>
          <p className="mt-2 text-gray-500 mb-2">
            We've sent a password reset link to
          </p>
          <p className="text-[#1F8A5B] font-bold text-[18px] mb-5">
            {email}
          </p>
          <p className="text-[#4A5565] text-[18px]">
            Click the link in the email to reset your password. The link will
            expire in 1 hour.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Submit Button */}
          <Link
            href={inboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#1F8A5B] hover:bg-[#157a49] text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            {isGmail ? "Open Gmail Inbox" : "Open Email App"}
          </Link>
          <p className="text-base text-[#475569] text-center">
            Didn't receive the email?{" "}
            <Link
              href={`/forgot-password?email=${encodeURIComponent(email)}`}
              className="text-[#1F8A5B] font-semibold"
            >
              Resend
            </Link>
          </p>
        </div>

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

export default CheckMail;
