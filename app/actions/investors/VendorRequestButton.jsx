"use client";

import { useState } from "react";
import { sendVendorRequest } from "../../../app/actions/investors/sendVendorRequest.js";

export default function VendorRequestButton({
  investorId,
  vendorUserId,
  initialStatus,
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    try {
      setLoading(true);
      setStatus("pending"); // optimistic

      const res = await sendVendorRequest({
        investorId,
        vendorUserId,
      });

      if (!res?.success) {
        setStatus(initialStatus);
      }
    } catch (err) {
      console.error(err);
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  if (status === "pending") {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700"
      >
        Request Sent
      </button>
    );
  }

  if (status === "accepted") {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-lg bg-green-600 text-white"
      >
        Connected
      </button>
    );
  }

  if (status === "rejected") {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-lg bg-red-500 text-white"
      >
        Rejected
      </button>
    );
  }

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
    >
      {loading ? "Sending..." : "Send Request"}
    </button>
  );
}
