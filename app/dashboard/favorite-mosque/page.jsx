"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { mosqueService } from "../../services/mosque";

export default function FavoriteMosques() {
  const router = useRouter();
  const [mosques, setMosques] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await mosqueService.getFavorites();
        const favorites = Array.isArray(response) ? response : [];

        const mapped = favorites
          .map((favorite) => {
            const mosque = favorite?.mosque;
            if (!mosque) return null;

            return {
              id: mosque.id,
              name: mosque.name,
              location: mosque.city_name
                ? `${mosque.city_name} • ${mosque.address || ""}`
                : mosque.address || "Dhaka",
            };
          })
          .filter(Boolean);

        setMosques(mapped);
      } catch (error) {
        console.error("Failed to load favorite mosques:", error);
        setMosques([]);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (mosqueId) => {
    try {
      await mosqueService.removeFavorite(mosqueId);
      setMosques((prev) => prev.filter((mosque) => mosque.id !== mosqueId));
    } catch (error) {
      console.error("Failed to remove favorite mosque:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] md:p-12 text-slate-800">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">Favorite Mosques</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your favorite mosques
        </p>
      </div>

      {/* Mosque List */}
      <div className="max-w-7xl mx-auto space-y-4">
        {mosques.map((mosque) => (
          <div
            key={mosque.id}
            className="bg-white rounded-2xl p-4 md:p-5 md:flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 transition-all hover:shadow-md"
          >
            {/* Left side: Icon and Info */}
            <div className="md:flex items-center gap-4 mb-4 md:mb-0">
              {/* Mosque Icon Box */}
              <div className="w-14 h-14 bg-[#238B57] rounded-xl flex items-center justify-center text-2xl shadow-inner">
                {/* In a real app, you'd use the <img> tag for the specific mosque graphic */}
                <span className="filter drop-shadow-sm">🕌</span>
              </div>

              {/* Text Information */}
              <div>
                <h3 className="text-[16px] font-bold text-[#1E293B]">
                  {mosque.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-[13px] mt-1">
                  <MapPin size={14} />
                  <span>{mosque.location}</span>
                </div>
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/mosques/${mosque.id}`)}
                className="bg-[#E9F3EE] text-[#238B57] px-5 py-2 rounded-lg text-[13px] font-bold hover:bg-[#dcece4] transition-colors"
              >
                View Details
              </button>

              <button
                onClick={() => handleRemoveFavorite(mosque.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                title="Remove from favorites"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {mosques.length === 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-slate-500">
            No favorite mosques yet.
          </div>
        )}
      </div>
    </div>
  );
}
