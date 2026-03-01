import Image from "next/image";
import React, { useEffect, useState } from "react";
import mosqueIcon from "../../../public/icons/mosque.png";
import EmptyStar from "../icons/EmptyStar";
import { Inter, Poppins } from "next/font/google";
import { MapPin, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { mosqueService } from "../../services/mosque";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const inter = Inter({
  subsets: ["latin"],
});
const MosqueCard = ({ mosque, onFavoriteChanged }) => {
  const [isFavorite, setIsFavorite] = useState(Boolean(mosque?.isFavorite));

  useEffect(() => {
    setIsFavorite(Boolean(mosque?.isFavorite));
  }, [mosque?.isFavorite]);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await mosqueService.removeFavorite(mosque.id);
        setIsFavorite(false);
        onFavoriteChanged?.(mosque.id, false);
      } else {
        await mosqueService.addFavorite(mosque.id);
        setIsFavorite(true);
        onFavoriteChanged?.(mosque.id, true);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100">
      {/* Top Section: Icon and Star */}
      <div className="flex items-start justify-between mb-4">
        {/* Mosque Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#1F8A5B] flex items-center justify-center flex-shrink-0">
          <Image
            src={mosqueIcon}
            width={24}
            height={24}
            alt="mosque icon"
            className="brightness-0 invert"
          />
        </div>
        {/* Star Icon */}
        <button
          onClick={handleFavoriteClick}
          className="p-1 hover:bg-gray-50 rounded-full transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <EmptyStar filled={isFavorite} />
        </button>
      </div>

      {/* Mosque Details */}
      <div>
        {/* Mosque Name */}
        <h3
          className={`text-base text-[#1E293B] font-semibold ${poppins.className} mb-2 line-clamp-2`}
        >
          {mosque.name}
        </h3>

        {/* Location and Distance */}
        <div
          className={`text-sm text-[#64748B] flex items-center gap-1.5 ${inter.className} mb-3`}
        >
          <MapPin size={14} className="text-[#64748B] flex-shrink-0" />
          <span>{mosque.location}</span>
          <span>•</span>
          <span>{mosque.distance} km</span>
        </div>

        {/* Next Prayer Time */}
        <div className="flex items-center gap-2 text-sm text-[#64748B] mb-4">
          <Clock size={14} className="flex-shrink-0" />
          <span>Next:</span>
          <span className="text-[#1E293B] font-medium">
            {mosque.prayer} - {mosque.time}
          </span>
        </div>

        {/* View Monthly Timetable Link */}
        <Link
          href={`/mosques/${mosque.id || 1}`}
          className="flex items-center gap-2 text-[#1F8A5B] text-sm font-medium hover:text-[#157a49] transition-colors"
        >
          <Calendar size={16} />
          <span>View Monthly Timetable</span>
        </Link>
      </div>
    </div>
  );
};

export default MosqueCard;
