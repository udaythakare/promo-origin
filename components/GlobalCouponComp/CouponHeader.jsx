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

  const isLocal = locationSource === "area" || locationSource === "city";

  const LocationBadge = () => (
    <span
      className="inline-flex items-center gap-1.5 text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 border-2 border-black tracking-wide"
      style={{ background: "#3716A8", boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
    >
      {isLocal ? <MapPin size={11} strokeWidth={2.5} /> : <Globe size={11} strokeWidth={2.5} />}
      {isLocal ? `${locationName?.toUpperCase()} DEALS` : "ALL COUPONS"}
    </span>
  );

  return (
    <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">

      {/* Top Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">

        {/* Left: badge + updated time */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <LocationBadge />
          {lastRefreshed && (
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              Updated {formatRefreshTime(lastRefreshed)}
            </span>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-white px-2.5 sm:px-3 py-1.5 border-2 border-black active:scale-95 hover:opacity-90 transition-all disabled:opacity-40 flex-shrink-0"
          style={{ background: "#3716A8", boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
        >
          <RefreshCw size={13} strokeWidth={2.5} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>

      </div>

      {/* Fallback message */}
      {locationSource === "all" && (
        <p className="text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-3 py-2 border border-gray-200 border-l-2 border-l-[#3716A8]">
          No coupons found near your location — showing all available coupons.
        </p>
      )}

    </div>
  );
};