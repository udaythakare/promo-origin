"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendVendorRequest } from "../../../app/actions/investors/sendVendorRequest.js";

export default function VendorRequestButton({
  investorId,
  vendorUserId,
  initialStatus,
  initialConnectionId,
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [connectionId, setConnectionId] = useState(initialConnectionId);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    try {
      setLoading(true);
      setStatus("pending");

      const res = await sendVendorRequest({ investorId, vendorUserId });

      if (res?.success) {
        setConnectionId(res.connectionId);
        setStatus("pending");
      } else {
        setStatus(res.status);
        setConnectionId(res.connectionId);
      }
    } catch (err) {
      console.error(err);
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  if (status === "accepted" && connectionId) {
    return (
      <button
        onClick={() => router.push(`/investors/messages/${connectionId}`)}
        className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
      >
        Open Chat
      </button>
    );
  }

  if (status === "pending") {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed"
      >
        Request Sent
      </button>
    );
  }

  if (status === "rejected") {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-lg bg-red-100 text-red-600 cursor-not-allowed"
      >
        Request Declined
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