"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Bell, Loader2, Trash2 } from "lucide-react";
import { subscriptionService } from "../../services/subscriptions";

export default function SubscribedMosques() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.list();
      setSubscriptions(Array.isArray(response) ? response : response.results || []);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (subscriptionId) => {
    if (!confirm("Are you sure you want to unsubscribe?")) return;

    try {
      await subscriptionService.delete(subscriptionId);
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.id !== subscriptionId)
      );
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
      alert("Failed to unsubscribe. Please try again.");
    }
  };

  const mosqueRows = subscriptions.flatMap((subscription) =>
    (subscription.selected_mosques_details || []).map((mosque) => ({
      key: `${subscription.id}-${mosque.id}`,
      subscriptionId: subscription.id,
      name: mosque.name,
      location: mosque.city ? `${mosque.city} • ${mosque.address}` : mosque.address,
    }))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] md:p-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#238B57]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] md:p-12 text-slate-800">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-[#1E293B]">Subscribe Mosques</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your subscriptions • {subscriptions.length} active
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Subscriptions List */}
      {mosqueRows.length === 0 ? (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl p-12 text-center shadow-sm">
          <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            No Active Subscriptions
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            You haven't subscribed to any mosques yet
          </p>
          <a
            href="/subscribe"
            className="inline-block bg-[#238B57] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1d7347] transition-colors"
          >
            Subscribe Now
          </a>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-4">
          {mosqueRows.map((mosque) => (
            <div
              key={mosque.key}
              className="bg-white rounded-2xl p-4 md:p-5 md:flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 transition-all hover:shadow-md"
            >
              {/* Left side: Icon and Info */}
              <div className="md:flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-14 h-14 bg-[#238B57] rounded-xl flex items-center justify-center text-2xl shadow-inner">
                  <span className="filter drop-shadow-sm">🕌</span>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-[#1E293B]">{mosque.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[13px] mt-1">
                    <MapPin size={14} />
                    <span>{mosque.location}</span>
                  </div>
                </div>
              </div>

              {/* Right side: Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleUnsubscribe(mosque.subscriptionId)}
                  className="bg-[#E9F3EE] text-[#238B57] px-5 py-2 rounded-lg text-[13px] font-bold hover:bg-[#dcece4] transition-colors"
                >
                  Unsubscribe
                </button>

                <button
                  onClick={() => handleUnsubscribe(mosque.subscriptionId)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Remove subscription"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
