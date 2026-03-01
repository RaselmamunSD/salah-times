"use client";

import { Poppins } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import rightArrowGreen from "../../../public/icons/rightArrowGreen.png";
import Image from "next/image";
import MosqueCard from "../cards/MosqueCard";
import { mosqueService } from "../../services/mosque";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const MosquesNearYou = ({ currentLocation, refreshKey }) => {
  const [mosques, setMosques] = useState([]);

  useEffect(() => {
    const fetchMosques = async () => {
      try {
        let response = [];
        let favoriteIds = new Set();

        try {
          const favoritesResponse = await mosqueService.getFavorites();
          const favorites = Array.isArray(favoritesResponse) ? favoritesResponse : [];
          favoriteIds = new Set(favorites.map((item) => item?.mosque?.id).filter(Boolean));
        } catch {
          favoriteIds = new Set();
        }

        if (currentLocation?.latitude && currentLocation?.longitude) {
          response = await mosqueService.getNearby(
            currentLocation.latitude,
            currentLocation.longitude,
            10
          );
        } else {
          response = await mosqueService.list();
        }

        const items = Array.isArray(response)
          ? response
          : Array.isArray(response?.results)
            ? response.results
            : [];

        const formatted = items.slice(0, 6).map((mosque) => ({
          id: mosque.id,
          name: mosque.name,
          location: mosque.city_name || mosque.address || "Dhaka",
          distance: mosque.distance_km ? mosque.distance_km.toFixed(1) : "2.3",
          prayer: "Dhuhr",
          time: "12:30 PM",
          isFavorite: favoriteIds.has(mosque.id),
        }));

        setMosques(formatted);
      } catch {
        setMosques([]);
      }
    };

    fetchMosques();
  }, [currentLocation?.latitude, currentLocation?.longitude, refreshKey]);

  const handleFavoriteChanged = (mosqueId, isFavorite) => {
    setMosques((prev) =>
      prev.map((item) =>
        item.id === mosqueId ? { ...item, isFavorite } : item
      )
    );
  };

  return (
    <div className="max-w-[1216px] mx-auto w-full md:mt-80 px-4 md:px-0">
      <div className="flex justify-between items-center mb-8">
        <h3
          className={`text-[24px] font-semibold text-[#1E293B] ${poppins.className}`}
        >
          Mosques Near You
        </h3>
        <Link
          href={`/mosques`}
          className="text-[#1F8A5B] text-base font-medium flex items-center gap-2.5 hover:text-[#157a49] transition-colors"
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
      {mosques.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mosques.map((mosque, index) => (
            <MosqueCard
              key={`${mosque.name}-${index}`}
              mosque={mosque}
              onFavoriteChanged={handleFavoriteChanged}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-[#64748B]">No verified mosques found yet.</div>
      )}
    </div>
  );
};

export default MosquesNearYou;
