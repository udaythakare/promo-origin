import React from "react";
import { SearchX } from "lucide-react";

export const EmptyState = ({ onClearFilters }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">

    {/* Icon */}
    <div className="mb-6 p-4 border-2 border-black rounded-xl bg-white shadow-md">
      <SearchX size={40} style={{ color: "#3716A8" }} />
    </div>

    {/* Title */}
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
      No Coupons Found
    </h2>

    {/* Description */}
    <p className="text-gray-500 max-w-md mb-6 text-sm sm:text-base">
      We couldn't find any coupons in this area. Try changing your filters or explore all available deals.
    </p>

    {/* Button */}
    <button
      onClick={onClearFilters}
      className="text-white font-semibold px-6 py-3 rounded-lg border-2 border-black transition-all hover:scale-105"
      style={{ background: "#3716A8" }}
    >
      View All Coupons
    </button>

  </div>
);