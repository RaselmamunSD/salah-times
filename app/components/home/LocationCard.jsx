"use client";

import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
});

const BANGLADESH_CITIES = [
  { city: "Dhaka", country: "Bangladesh", latitude: 23.8103, longitude: 90.4125 },
  { city: "Chittagong", country: "Bangladesh", latitude: 22.3569, longitude: 91.7832 },
  { city: "Khulna", country: "Bangladesh", latitude: 22.8456, longitude: 89.5403 },
  { city: "Rajshahi", country: "Bangladesh", latitude: 24.3745, longitude: 88.6042 },
];

export default function LocationCard({ location, onLocationChange }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  const handleUseCurrentLocation = () => {
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
        closeModal();
        setIsLoading(false);
      },
      () => {
        onLocationChange?.({
          name: "Location permission denied",
          latitude: null,
          longitude: null,
        });
        closeModal();
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const filteredCities = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return BANGLADESH_CITIES;

    return BANGLADESH_CITIES.filter((item) =>
      item.city.toLowerCase().includes(query)
    );
  }, [searchValue]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchValue("");
  };

  const handleSelectCity = (item) => {
    onLocationChange?.({
      name: `${item.city}, ${item.country}`,
      latitude: item.latitude,
      longitude: item.longitude,
    });
    closeModal();
  };

  useEffect(() => {
    if (!isModalOpen) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <div
        className={`w-full max-w-md mt-4 md:mt-10 ${inter.className} md:h-full`}
      >
        <div className="bg-white/10 backdrop-blur-lg h-[80px] md:h-full border border-[#5d9ca3] rounded-3xl p-3 md:p-6 overflow-hidden">
          <div className="md:flex justify-between items-center mb-4">
            <div className="flex justify-between">
              <span className="text-white/60 text-xs md:text-sm font-medium">
                Current Location
              </span>
              <button
                onClick={openModal}
                className=" text-white/80 text-xs flex md:hidden items-center gap-1 hover:text-white"
              >
                <MapPin size={12} /> Change
              </button>
            </div>
            <button
              onClick={openModal}
              className="hidden text-white/80 text-xs md:flex items-center gap-1 hover:text-white"
            >
              <MapPin size={12} /> Change
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-[390px] bg-white rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <div className="px-5 pt-5 pb-4 border-b border-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[16px] leading-tight font-bold text-[#1E293B]">
                    Change Location
                  </h3>
                  <p className="text-[12px] text-[#64748B] mt-2">
                    Select your city for accurate prayer times
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-[#64748B] hover:text-[#1E293B] mt-1"
                  aria-label="Close location modal"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="px-5 py-5">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLoading}
                className="w-full h-[58px] rounded-[12px] bg-[#24905E] hover:bg-[#1c7a4f] text-white text-[16px] font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Navigation size={18} />
                )}
                Use Current Location (GPS)
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[16px] text-[#64748B]">Or select manually</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]"
                />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search for your city..."
                  className="w-full h-[56px] rounded-[14px] border border-[#D6DEE8] pl-12 pr-4 text-[16px] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#24905E]"
                />
              </div>

              <div className="mt-5 max-h-[280px] overflow-y-auto">
                {filteredCities.map((item) => (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => handleSelectCity(item)}
                    className="w-full text-left px-2 py-3 rounded-xl hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin size={17} className="text-[#24905E] mt-1 shrink-0" />
                      <div>
                        <p className="text-[16px] leading-tight font-medium text-[#1E293B]">
                          {item.city}
                        </p>
                        <p className="text-[14px] text-[#64748B] mt-1">
                          {item.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredCities.length === 0 && (
                  <div className="px-2 py-6 text-center text-[16px] text-[#94A3B8]">
                    No city found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
