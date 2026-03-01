"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { useAxios } from "../../providers/AxiosProvider";

export default function LocationManagement() {
  const axios = useAxios();
  const [locationValue, setLocationValue] = useState("Dhaka, Bangladesh (GPS)");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(true);

  const syncCity = useCallback(
    async (city) => {
      await axios.post("/api/users/profile/update_preferences/", {
        current_city: city.id,
      });
      setLocationValue(`${city.name}, ${city.country_name || "Bangladesh"} (GPS)`);
    },
    [axios]
  );

  const loadCurrentLocation = useCallback(async () => {
    try {
      const response = await axios.get("/api/users/profile/me/");
      const profile = response.data;
      if (profile?.current_city_name) {
        setLocationValue(`${profile.current_city_name} (Saved)`);
      }
    } catch (error) {
      console.error("Failed to load current location:", error);
    }
  }, [axios]);

  useEffect(() => {
    const savedLocationPermission = localStorage.getItem("location_services_enabled");
    if (savedLocationPermission !== null) {
      setLocationServicesEnabled(savedLocationPermission === "true");
    }
    loadCurrentLocation();
  }, [loadCurrentLocation]);

  const handleUseGps = async () => {
    if (!locationServicesEnabled) {
      alert("Location services are disabled. Enable it from Settings first.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const cityResponse = await axios.get("/api/locations/cities/by_coordinates/", {
        params: { latitude, longitude },
      });

      await syncCity(cityResponse.data);
      alert("Location updated successfully.");
    } catch (error) {
      console.error("GPS location update failed:", error);
      alert("Failed to update location from GPS.");
    } finally {
      setGpsLoading(false);
    }
  };

  const handleChangeManually = async () => {
    const cityQuery = window.prompt("Enter city name");
    if (!cityQuery || cityQuery.trim().length < 2) {
      return;
    }

    setManualLoading(true);
    try {
      const response = await axios.get("/api/locations/cities/search/", {
        params: { q: cityQuery.trim() },
      });

      const cities = Array.isArray(response.data) ? response.data : [];
      if (!cities.length) {
        alert("No city found with that name.");
        return;
      }

      const exactMatch = cities.find(
        (city) => city.name.toLowerCase() === cityQuery.trim().toLowerCase()
      );
      const selectedCity = exactMatch || cities[0];

      await syncCity(selectedCity);
      alert("Location changed successfully.");
    } catch (error) {
      console.error("Manual location update failed:", error);
      alert("Failed to change location.");
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Location Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your location for accurate prayer times
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Current Location Card */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            Current Location
          </h2>

          <div className="space-y-6">
            {/* Input Field Area */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Location
              </label>
              <input
                type="text"
                readOnly
                value={locationValue}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-slate-500 focus:outline-none cursor-default"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleUseGps}
                disabled={gpsLoading}
                className="flex items-center gap-2 bg-[#216B7B] hover:bg-[#1a5562] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <MapPin size={16} />
                {gpsLoading ? "Updating..." : "Use GPS Location"}
              </button>

              <button
                onClick={handleChangeManually}
                disabled={manualLoading}
                className="bg-[#E9F3EE] hover:bg-[#dcece4] text-[#238B57] px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {manualLoading ? "Updating..." : "Change Manually"}
              </button>
            </div>
          </div>
        </div>

        {/* Location Note Card */}
        <div className="bg-[#F2F8FA] rounded-xl p-6 md:p-8 border border-[#E5F0F4]">
          <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <span>📍</span> Location Note
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your location is used to show accurate prayer times based on your
            geographical position. When you update your location, prayer times
            will automatically update to match your new area.
          </p>
        </div>
      </div>
    </div>
  );
}
