import { Poppins } from "next/font/google";
import Link from "next/link";
import React from "react";
import rightArrowGreen from "../../../public/icons/rightArrowGreen.png";
import Image from "next/image";
import MosqueCard from "../cards/MosqueCard";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const MosquesNearYou = () => {
  const mosques = [
    {
      name: "Baitul Mukarram National Mosque",
      location: "Dhaka",
      distance: 2.3,
      prayer: "Dhuhr",
      time: "12:30 PM",
    },
    {
      name: "Baitul Mukarram National Mosque",
      location: "Dhaka",
      distance: 2.3,
      prayer: "Dhuhr",
      time: "12:30 PM",
    },
    {
      name: "Baitul Mukarram National Mosque",
      location: "Dhaka",
      distance: 2.3,
      prayer: "Dhuhr",
      time: "12:30 PM",
    },
    {
      name: "Baitul Mukarram National Mosque",
      location: "Dhaka",
      distance: 2.3,
      prayer: "Dhuhr",
      time: "12:30 PM",
    },
    {
      name: "Baitul Mukarram National Mosque",
      location: "Dhaka",
      distance: 2.3,
      prayer: "Dhuhr",
      time: "12:30 PM",
    },
    {
      name: "Baitul Mukarram National Mosque",
      location: "Dhaka",
      distance: 2.3,
      prayer: "Dhuhr",
      time: "12:30 PM",
    },
  ];
  return (
    <div className="mt-[400px] max-w-[1216px] mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <h3
          className={`text-[24px] font-semibold text-[#1E293B] ${poppins.className}`}
        >
          Mosques Near You
        </h3>
        <Link
          href={`/`}
          className="text-[#1F8A5B] text-base font-medium flex items-center gap-2.5"
        >
          View All{" "}
          <Image
            src={rightArrowGreen}
            width={4.5}
            height={9}
            alt="right green arrow"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {mosques.map((mosque, index) => (
          <MosqueCard key={index} mosque={mosque} />
        ))}
      </div>
    </div>
  );
};

export default MosquesNearYou;
