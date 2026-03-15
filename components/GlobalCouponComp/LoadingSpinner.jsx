import React from "react";

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-4">

    {/* Neo-brutalist spinner frame */}
    <div className="relative">
      {/* Offset shadow block */}
      <div
        className="absolute top-1.5 left-1.5 w-14 h-14 bg-black"
      />
      {/* Spinner inside bordered box */}
      <div className="relative w-14 h-14 border-2 border-black bg-white flex items-center justify-center">
        <div
          className="h-8 w-8 border-[3px] border-black border-t-transparent animate-spin"
          style={{ borderRightColor: "#3716A8", borderBottomColor: "#3716A8" }}
        />
      </div>
    </div>

    {/* Loading label */}
    <span
      className="text-xs font-black tracking-widest uppercase px-3 py-1 border-2 border-black text-white"
      style={{ background: "#3716A8", boxShadow: "2px 2px 0px 0px rgba(0,0,0,1)" }}
    >
      Loading Coupons...
    </span>

  </div>
);