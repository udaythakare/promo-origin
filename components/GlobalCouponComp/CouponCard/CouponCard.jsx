import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  QrCode,
  Scissors,
  Timer,
  Store,
  X,
  MapPin,
  Flame
} from "lucide-react";

import { joinAddress } from "@/utils/addressUtils";
import ClaimsCounter from "@/app/business/dashboard/coupons/components/ClaimCounter";

export const CouponCard = ({
  coupon,
  isClaimed,
  claimingStatus,
  session,
  onClaimClick,
  onShowQR,
  onToggleDetails,
  userId
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const getProgressBarWidth = (current, max) => {
    if (!current || !max) return "0%";
    return `${Math.min((current / max) * 100, 100)}%`;
  };

  const handleToggleDetails = () => {
    setDetailsOpen(!detailsOpen);
    if (onToggleDetails) onToggleDetails(coupon.id);
  };

  return (
    <div className="w-full bg-white border-2 border-black flex flex-col"
      style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}>

      {/* ── TOP BAR ── */}
      <div
        className="px-3 py-2 flex items-center justify-between text-xs font-bold text-white"
        style={{ background: "linear-gradient(90deg,#3716A8,#2C1288)" }}
      >
        <span className="flex items-center gap-1.5">
          <Flame size={13} strokeWidth={2.5} />
          Hot Deal
        </span>
        <span className="text-white/80 font-semibold">
          Ends {formatDate(coupon.end_date)}
        </span>
      </div>

      {/* ── BODY ── */}
      <div className="p-3 flex flex-col gap-2 flex-grow">

        {/* Title */}
        <h2 className="text-sm font-black text-gray-900 line-clamp-2 leading-tight">
          {coupon.title}
        </h2>

        {/* Store */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Store size={12} strokeWidth={2.5} />
          <span className="font-bold truncate">
            {coupon?.businesses?.name || "Vendor"}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {coupon.description || "No description available"}
        </p>

        {/* Claims Counter + Progress */}
        <div>
          <ClaimsCounter
            couponId={coupon.id}
            initialCount={coupon.current_claims}
            maxClaims={coupon.max_claims}
            userId={userId}
          />
          <div className="w-full bg-gray-200 h-1.5 mt-1 overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: getProgressBarWidth(coupon.current_claims, coupon.max_claims),
                background: "#3716A8"
              }}
            />
          </div>
        </div>

        {/* Dashed Divider */}
        <div className="border-t border-dashed border-gray-300" />

        {/* Expandable Details */}
        {detailsOpen && (
          <div className="text-xs text-gray-600 space-y-1.5">
            <div className="flex items-start gap-1.5">
              <MapPin size={12} className="flex-shrink-0 mt-0.5" />
              <span className="leading-snug">
                {coupon?.businesses?.business_locations?.[0]
                  ? joinAddress(coupon.businesses.business_locations[0])
                  : "Store location"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold" style={{ color: "#3716A8" }}>
              <Timer size={12} />
              {formatDate(coupon.start_date)} – {formatDate(coupon.end_date)}
            </div>
          </div>
        )}

        {/* Toggle Details */}
        <button
          onClick={handleToggleDetails}
          className="text-xs font-bold flex items-center gap-1 w-fit active:scale-95 transition-transform"
          style={{ color: "#3716A8" }}
        >
          {detailsOpen
            ? <><ChevronUp size={13} /> Hide details</>
            : <><ChevronDown size={13} /> View details</>
          }
        </button>

        {/* ── ACTION BUTTONS ── */}
        <div className="mt-auto pt-1">
          {isClaimed ? (
            <div className="flex gap-2">
              <button
                disabled
                className="flex-1 bg-green-600 text-white text-xs font-bold py-2.5 border-2 border-black flex items-center justify-center gap-1.5"
              >
                <Check size={13} strokeWidth={2.5} />
                Claimed
              </button>
              <button
                onClick={() => onShowQR(coupon)}
                className="px-3 bg-black text-white text-xs font-bold py-2.5 border-2 border-black hover:bg-gray-800 active:scale-95 flex items-center gap-1 transition-all"
              >
                <QrCode size={14} />
              </button>
            </div>

          ) : coupon.current_claims >= coupon.max_claims ? (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 text-xs font-bold py-2.5 border-2 border-black flex items-center justify-center gap-1.5"
            >
              <X size={13} strokeWidth={2.5} />
              Fully Claimed
            </button>

          ) : claimingStatus === "claiming" ? (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-500 text-xs font-bold py-2.5 border-2 border-black"
            >
              Claiming...
            </button>

          ) : (
            <button
              onClick={() => onClaimClick(coupon)}
              disabled={!session}
              className={`w-full text-xs font-bold py-2.5 border-2 border-black flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                !session
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-white hover:opacity-90"
              }`}
              style={session ? { background: "#3716A8" } : {}}
            >
              <Scissors size={13} strokeWidth={2.5} />
              {!session ? "Sign in to claim" : "Claim Coupon"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};