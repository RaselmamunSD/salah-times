import Image from "next/image";
import React from "react";
import mosqueIcon from "../../../public/icons/mosque.png";
import EmptyStar from "../icons/EmptyStar";
import locationIcon from "../../../public/icons/location.png";
import clock from "../../../public/icons/clock.png";
import { Inter, Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const inter = Inter({
  subsets: ["latin"],
});
const MosqueCard = ({ mosque }) => {
  return (
    <div className="rounded-[14px] shadow-xl p-6">
      {/* Top */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-[14px] bg-linear-to-br from-[#1F8A5B] to-[#1F6F8B] w-12">
          <Image src={mosqueIcon} width={24} height={32} alt="mosque icon" />
        </div>
        <EmptyStar />
      </div>
      {/* mosque details */}
      <div>
        <h3
          className={`text-base text-[#1E293B] font-semibold ${poppins.className} mb-2`}
        >
          {mosque.name}
        </h3>

        {/* location and distance */}
        <div
          className={`text-sm text-[#64748B] flex items-center gap-1 ${inter.className} border-b border-gray-100 pb-4 mb-[13px]`}
        >
          <p className="flex items-center gap-1">
            <Image
              src={locationIcon}
              width={14}
              height={14}
              alt="location icon"
            />{" "}
            {mosque.location}
          </p>
          <p>• {mosque.distance} km</p>
        </div>

        {/* Salah time */}
        <div>
          <p className="flex items-center gap-2 text-[#64748B] text-sm">
            <Image src={clock} width={14} height={14} alt="clock" /> Next:{" "}
            <span className="text-[#1E293B] text-sm font-medium">
              {mosque.prayer} - {mosque.time}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MosqueCard;
