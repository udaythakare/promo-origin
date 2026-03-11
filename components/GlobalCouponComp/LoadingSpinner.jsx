import React from "react";

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16">

    {/* Spinner */}
    <div
      className="h-14 w-14 border-4 border-black border-t-transparent rounded-full animate-spin"
      style={{ borderRightColor: "#3716A8", borderBottomColor: "#3716A8" }}
    ></div>

    {/* Loading Text */}
    <p className="mt-4 text-sm font-medium text-gray-600">
      Loading coupons...
    </p>

  </div>
);