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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
    <div className="w-full max-w-[280px] mx-auto bg-white border-2 border-black rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">

      {/* TOP BAR */}
      <div
        className="text-white px-3 py-1.5 flex items-center justify-between text-xs font-semibold"
        style={{ background: "linear-gradient(90deg,#3716A8,#2C1288)" }}
      >
        <span className="flex items-center gap-1">
          <Flame size={14} /> Hot Deal
        </span>
        <span>Ends {formatDate(coupon.end_date)}</span>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-grow">

        {/* TITLE */}
        <h2 className="text-sm font-bold text-gray-900 line-clamp-2">
          {coupon.title}
        </h2>

        {/* STORE */}
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Store size={13} />
          <span className="font-semibold">
            {coupon?.businesses?.name || "Vendor"}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-xs text-gray-600 line-clamp-2">
          {coupon.description || "No description available"}
        </p>

        {/* CLAIM COUNTER */}
        <div>
          <ClaimsCounter
            couponId={coupon.id}
            initialCount={coupon.current_claims}
            maxClaims={coupon.max_claims}
            userId={userId}
          />

          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full"
              style={{
                width: getProgressBarWidth(
                  coupon.current_claims,
                  coupon.max_claims
                ),
                background: "#3716A8"
              }}
            />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-dashed border-gray-300 my-1"></div>

        {/* DETAILS */}
        {detailsOpen && (
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-start gap-1">
              <MapPin size={13} />
              <span>
                {coupon?.businesses?.business_locations &&
                coupon.businesses.business_locations[0]
                  ? joinAddress(coupon.businesses.business_locations[0])
                  : "Store location"}
              </span>
            </div>

            <div
              className="flex items-center gap-1 font-medium"
              style={{ color: "#3716A8" }}
            >
              <Timer size={13} />
              {formatDate(coupon.start_date)} – {formatDate(coupon.end_date)}
            </div>
          </div>
        )}

        {/* TOGGLE */}
        <button
          onClick={handleToggleDetails}
          className="text-xs font-medium flex items-center gap-1"
          style={{ color: "#3716A8" }}
        >
          {detailsOpen ? (
            <>
              Hide details <ChevronUp size={13} />
            </>
          ) : (
            <>
              View details <ChevronDown size={13} />
            </>
          )}
        </button>

        {/* ACTION BUTTONS */}
        <div className="mt-auto pt-2">

          {isClaimed ? (
            <div className="flex gap-2">
              <button
                disabled
                className="flex-1 bg-green-600 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
              >
                <Check size={13} />
                Claimed
              </button>

              <button
                onClick={() => onShowQR(coupon)}
                className="px-3 bg-black text-white text-xs font-semibold py-2 rounded-lg hover:bg-gray-900 flex items-center gap-1"
              >
                <QrCode size={13} />
              </button>
            </div>
          ) : coupon.current_claims >= coupon.max_claims ? (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
            >
              <X size={13} />
              Fully Claimed
            </button>
          ) : claimingStatus === "claiming" ? (
            <button
              disabled
              className="w-full bg-gray-100 text-gray-600 text-xs font-semibold py-2 rounded-lg"
            >
              Claiming...
            </button>
          ) : (
            <button
              onClick={() => onClaimClick(coupon)}
              disabled={!session}
              className={`w-full text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1 ${
                !session
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-white"
              }`}
              style={session ? { background: "#3716A8" } : {}}
            >
              <Scissors size={13} />
              {!session ? "Sign in to claim" : "Claim Coupon"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};