import React from "react";
import { RefreshCw, MapPin, Globe } from "lucide-react";

export const CouponHeader = ({
  lastRefreshed,
  loading,
  onRefresh,
  locationSource,
  locationName,
}) => {
  const formatRefreshTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLocationBadge = () => {
    if (locationSource === "area") {
      return (
        <span
          className="flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-md border-2 border-black"
          style={{ background: "#3716A8" }}
        >
          <MapPin size={12} />
          {locationName?.toUpperCase()} DEALS
        </span>
      );
    }

    if (locationSource === "city") {
      return (
        <span
          className="flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-md border-2 border-black"
          style={{ background: "#3716A8" }}
        >
          <MapPin size={12} />
          {locationName?.toUpperCase()} DEALS
        </span>
      );
    }

    return (
      <span
        className="flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-md border-2 border-black"
        style={{ background: "#3716A8" }}
      >
        <Globe size={12} />
        ALL COUPONS
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3 mb-6">

      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <div className="flex items-center gap-3 flex-wrap">
          {getLocationBadge()}

          {lastRefreshed && (
            <span className="text-xs text-gray-500">
              Updated {formatRefreshTime(lastRefreshed)}
            </span>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-medium text-white px-3 py-1.5 rounded-md border-2 border-black hover:scale-105 transition-all disabled:opacity-50"
          style={{ background: "#3716A8" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>

      </div>

      {/* Fallback message */}
      {locationSource === "all" && (
        <p className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded border border-gray-200">
          No coupons found near your location — showing all available coupons.
        </p>
      )}
    </div>
  );
};