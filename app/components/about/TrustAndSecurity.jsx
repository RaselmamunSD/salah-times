import React from "react";
import verification from "../../../public/icons/verification.png";
import community from "../../../public/icons/community.png";
import realTime from "../../../public/icons/realTime.png";
import Image from "next/image";
const TrustAndSecurity = () => {
  const trusts = [
    {
      icon: verification,
      title: "Verified Sources",
      sub: "All data comes directly from registered mosques and verified Islamic institutions",
    },
    {
      icon: community,
      title: "Community Driven",
      sub: "Built with feedback from imams, scholars, and community members",
    },
    {
      icon: realTime,
      title: "99.9% Uptime",
      sub: "Reliable service you can depend on for your daily prayers",
    },
  ];
  return (
    <div className="mt-15 bg-[#E9F5F0] max-w-[1216px] w-full mx-auto text-center rounded-[16px] py-8">
      <h1 className="text-[#1E293B] text-[30px] font-semibold mb-6">
        Trust & Accuracy
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {trusts.map((trust, index) => (
          <div key={index} className="max-w-[320px] mx-auto rounded-[16px]">
            <div className="bg-white w-16 h-16 rounded-full shadow-xl flex justify-center items-center mx-auto mb-4">
              <Image src={trust.icon} width={32} height={32} alt="icon" />
            </div>
            <h3 className="text-[#1E293B] text-base font-semibold mb-2">
              {trust.title}
            </h3>
            <p className="text-[#64748B] text-[14px]">{trust.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustAndSecurity;
