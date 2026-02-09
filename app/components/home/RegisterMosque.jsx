import { Inter } from "next/font/google";
import React from "react";
import tick from "../../../public/icons/tick.png";
import mosque from "../../../public/icons/mosque.png";
import Image from "next/image";
const inter = Inter({
  subsets: ["latin"],
});
const RegisterMosque = () => {
  const features = [
    {
      title: "Easy Registration",
      sub: "Simple form to register your mosque in minutes",
    },
    {
      title: "Admin Verification",
      sub: "Quick verification process through WhatsApp",
    },
    {
      title: "Full Control",
      sub: "Manage prayer times and details anytime",
    },
    {
      title: "Reach Thousands",
      sub: "Connect with community members in your area",
    },
  ];
  return (
    <section className="lg:w-[1216px] mx-auto my-25 lg:flex shadow-2xl">
      {/* left side */}
      <div className="flex-1 bg-linear-to-b from-[#1F8A5B] to-[#1F6F8B] p-12 text-white rounded-l-2xl">
        <h1 className="font-semibold text-[30px] mb-4">Register Your Mosque</h1>
        <p className={`${inter.className} text-[18px] text-white/70 mb-4`}>
          Join our network and help your community stay connected with accurate
          prayer times
        </p>
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-2xl flex justify-center items-center rounded-[14px]">
                <Image src={tick} width={21} height={32} alt="tick icon" />
              </div>
              <div>
                <h3 className="font-semibold text-[18px]">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right side */}
      <div className="flex-1 flex justify-center items-center rounded-r-2xl px-12">
        <div>
          {/* mosque image */}
          <div className="mb-6 bg-linear-to-b from-[#1F8A5B] to-[#1F6F8B] rounded-[16px] w-[96px] h-[96px] flex justify-center items-center mx-auto">
            <Image src={mosque} alt="mosque" width={48} height={48} />
          </div>
          {/* Texts */}
          <div className="text-center">
            <h3 className="text-[#1E293B] text-[24px] font-semibold mb-3">
              Add Your Mosque to Our Platform
            </h3>
            <p className="text-[#64748B] text-base mb-8">
              Help your community stay connected with accurate, up-to-date
              prayer times
            </p>
          </div>
          <button className="bg-[#1F8A5B] text-white font-medium text-[18px] w-full p-4 rounded-[14px] cursor-pointer">
            Register Your Mosque
          </button>
        </div>
      </div>
    </section>
  );
};

export default RegisterMosque;
