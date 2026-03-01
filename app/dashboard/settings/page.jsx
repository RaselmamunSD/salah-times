"use client";

import React, { useEffect, useState } from "react";
import { useAxios } from "../../providers/AxiosProvider";
import { useAuth } from "../../providers/AuthProvider";
import authService from "../../services/auth";

export default function AccountSettings() {
  const axios = useAxios();
  const { logout } = useAuth();
  const [prayerNotifications, setPrayerNotifications] = useState(true);
  const [mosqueUpdates, setMosqueUpdates] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [savingPrayer, setSavingPrayer] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get("/api/users/profile/me/");
        const profile = response.data;
        const prayerEnabled =
          profile.fajr_notification ||
          profile.dhuhr_notification ||
          profile.asr_notification ||
          profile.maghrib_notification ||
          profile.isha_notification;

        setPrayerNotifications(Boolean(prayerEnabled));
      } catch (error) {
        console.error("Failed to load settings:", error);
      }

      const savedMosqueUpdates = localStorage.getItem("mosque_updates_enabled");
      if (savedMosqueUpdates !== null) {
        setMosqueUpdates(savedMosqueUpdates === "true");
      }

      const savedLocationServices = localStorage.getItem("location_services_enabled");
      if (savedLocationServices !== null) {
        setLocationServices(savedLocationServices === "true");
      }
    };

    loadSettings();
  }, [axios]);

  const handlePrayerToggle = async () => {
    const nextValue = !prayerNotifications;
    setPrayerNotifications(nextValue);
    setSavingPrayer(true);

    try {
      await axios.post("/api/users/profile/update_preferences/", {
        fajr_notification: nextValue,
        dhuhr_notification: nextValue,
        asr_notification: nextValue,
        maghrib_notification: nextValue,
        isha_notification: nextValue,
      });
    } catch (error) {
      console.error("Failed to save prayer notification settings:", error);
      setPrayerNotifications(!nextValue);
      alert("Failed to update prayer notification settings.");
    } finally {
      setSavingPrayer(false);
    }
  };

  const handleMosqueUpdatesToggle = () => {
    const nextValue = !mosqueUpdates;
    setMosqueUpdates(nextValue);
    localStorage.setItem("mosque_updates_enabled", String(nextValue));
  };

  const handleLocationServicesToggle = () => {
    const nextValue = !locationServices;
    setLocationServices(nextValue);
    localStorage.setItem("location_services_enabled", String(nextValue));
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      await authService.deleteAccount();
      await logout();
    } catch (error) {
      console.error("Delete account failed:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            Notification Preferences
          </h2>

          <div className="space-y-6">
            {/* Item 1 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Prayer Time Notifications
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Receive notifications for prayer times
                </p>
              </div>
              <input
                type="checkbox"
                className="checkbox"
                checked={prayerNotifications}
                onChange={handlePrayerToggle}
                disabled={savingPrayer}
              />
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Mosque Updates
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Get updates from your favorite mosques
                </p>
              </div>
              <input
                type="checkbox"
                className="checkbox"
                checked={mosqueUpdates}
                onChange={handleMosqueUpdatesToggle}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            Privacy Settings
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Location Services
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Allow app to access your location
              </p>
            </div>
            <input
              type="checkbox"
              className="checkbox"
              checked={locationServices}
              onChange={handleLocationServicesToggle}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 rounded-xl p-6 md:p-8 border border-red-100">
          <h2 className="text-base font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-500 mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-[#E50000] hover:bg-red-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
