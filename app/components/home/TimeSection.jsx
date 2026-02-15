import Image from "next/image";
import React from "react";
import calendar from "../../../public/icons/calendar.png";
import rightArrow from "../../../public/icons/rightArrow.png";
import TimeCard from "../cards/TimeCard";
import { Inter, Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
});
const TimeSection = () => {
  const times = [
    {
      waqt: "Fajr",
      time: "05:45 AM",
    },
    {
      waqt: "Sunrise",
      time: "07:12 AM",
    },
    {
      waqt: "Dhuhr",
      time: "12:30 PM",
    },
    {
      waqt: "Asr",
      time: "4:20 PM",
    },
    {
      waqt: "Asr",
      time: "4:20 PM",
    },
    {
      waqt: "Asr",
      time: "4:20 PM",
    },
  ];
  return (
    <div
      className={`lg:w-[1216px] bg-white shadow-xl lg:rounded-2xl ${poppins.className} p-8 shadow-2xl mt-9 lg:mt-14`}
    >
      <div className="lg:flex justify-between">
        <div>
          <h1 className="text-[24px] font-semibold mb-[3px]">
            Today's{" "}
            <span className="text-[#1F8A5B]">Gulshan Central Mosque</span>{" "}
            Prayer Times
          </h1>
          <p
            className={`text-[#64748B] ${inter.className} text-base flex items-center gap-1 mb-4 lg:mb-0`}
          >
            <Image src={calendar} width={16} height={16} alt="calendar" />{" "}
            Thursday, January 22, 2026
          </p>
        </div>
        <div>
          <p className="text-[#64748B] text-[14px]">Next Prayer</p>
          <p className="text-[#1F8A5B] font-semibold text-2xl">2h 15m</p>
        </div>
      </div>

      {/* Time Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mt-6">
        {times.map((time, index) => (
          <TimeCard key={index} time={time} />
        ))}
      </div>

      {/* Subscription part */}
      <div
        className={`bg-gradient-to-br from-[#E9F5F0] to-[#EEF7FB] p-4 ${inter.className} rounded-[14px] mt-6`}
      >
        <div className="lg:flex justify-between items-center space-y-2 lg:space-y-0">
          {/* Subscribe Texts */}
          <div>
            <h3 className="text-base font-medium text-[#1E293B]">
              Never Miss a Prayer
            </h3>
            <p className="text-[#64748B] text-sm">
              Get notifications via WhatsApp or Email
            </p>
          </div>
          <div>
            {/* Subscribe button */}
            <Link
              href="/subscribe"
              className="bg-[#1F8A5B] py-3 px-6 text-white rounded-[10px] flex items-center gap-1 justify-center text-base cursor-pointer"
            >
              Subscribe{" "}
              <Image
                src={rightArrow}
                width={18}
                height={18}
                alt="right arrow"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSection;
