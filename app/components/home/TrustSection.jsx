import React from "react";

const TrustSection = () => {
  const stats = [
    {
      number: "500+",
      name: "Registered Mosques",
      color: "text-[#1F8A5B]",
    },
    {
      number: "500+",
      name: "Active Subscribers",
      color: "text-[#1F6F8B]",
    },
    {
      number: "99.9%",
      name: "Accuracy Rate",
      color: "text-[#C9A24D]",
    },
  ];
  return (
    <div className="bg-linear-to-r from-[#E9F5F0] to-[#EEF7FB] w-full py-[50px]">
      {/*Texts*/}
      <div className="text-center mb-[72px]">
        <h1 className="font-semibold text-[30px] text-[#1E293B] mb-4">
          Trusted by the Community
        </h1>
        <p className="text-[18px] text-[#64748B]">
          Our prayer times are verified and regularly updated through AI-powered
          data collection <br /> from local mosques. Accuracy you can trust for
          your spiritual journey.
        </p>
      </div>
      {/* stats */}
      <div className="lg:flex justify-around items-center space-y-4 lg:space-y-0 max-w-[1018px] mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <h3 className={`${stat.color} font-bold text-4xl`}>
              {stat.number}
            </h3>
            <p className="text-[#64748B] text-[16px]">{stat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSection;
