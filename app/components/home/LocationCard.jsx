"use client";

import { Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
});
export default function LocationCard({ location, onLocationChange }) {
  const [isLoading, setIsLoading] = useState(false);

  const getReadableLocation = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }

      const data = await response.json();

      if (!data?.address) {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state_district;
      const country = data.address.country;

      if (city && country) {
        return `${city}, ${country}`;
      }

      return data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleLocationChange = () => {
    if (!navigator.geolocation) {
      onLocationChange?.({
        name: "Location not supported",
        latitude: null,
        longitude: null,
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const readableLocation = await getReadableLocation(latitude, longitude);
        onLocationChange?.({
          name: readableLocation,
          latitude,
          longitude,
        });
        setIsLoading(false);
      },
      () => {
        onLocationChange?.({
          name: "Location permission denied",
          latitude: null,
          longitude: null,
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div
      className={`w-full max-w-md mt-4 md:mt-10 ${inter.className} md:h-full`}
    >
      <div className="bg-white/10 backdrop-blur-lg h-[80px] md:h-full border border-[#5d9ca3] rounded-3xl p-3 md:p-6 overflow-hidden">
        <div className="md:flex justify-between items-center mb-4">
          {" "}
          <div className="flex justify-between">
            <span className="text-white/60 text-xs md:text-sm font-medium">
              Current Location
            </span>
            <button
              onClick={handleLocationChange}
              disabled={isLoading}
              className=" text-white/80 text-xs flex md:hidden items-center gap-1 hover:text-white disabled:opacity-60"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />} Change
            </button>
          </div>
          <button
            onClick={handleLocationChange}
            disabled={isLoading}
            className="hidden text-white/80 text-xs md:flex items-center gap-1 hover:text-white disabled:opacity-60"
          >
            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />} Change
          </button>
          <div className="md:hidden text-white md:text-2xl font-medium text-center py-2">
            {location?.name || "Dhaka, Bangladesh"}
          </div>
        </div>
        <div className="hidden md:block text-white md:text-2xl font-medium text-center py-2">
          {location?.name || "Dhaka, Bangladesh"}
        </div>
      </div>
    </div>
  );
}
