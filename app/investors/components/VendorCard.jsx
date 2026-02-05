"use client";

import { useState } from "react";
import { sendConnectionRequest } from "../../actions/investors/sendConnectionRequest";


export default function VendorCard({ vendor }) {
  const [status, setStatus] = useState("idle"); // idle, sending, sent, error

  const handleSendRequest = async () => {
    setStatus("sending");

    try {
      const result = await sendConnectionRequest(vendor.id);

      if (result.success) {
        setStatus("sent");
      } else {
        setStatus("error");
        alert(result.message || "Failed to send request");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setStatus("error");
      alert("Network error. Please try again.");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      
      {/* Image Placeholder */}
      <div className="h-32 bg-green-100 flex items-center justify-center">
        <span className="text-4xl">🏪</span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{vendor.name}</h3>
        <p className="text-sm text-gray-500">{vendor.category}</p>

        <div className="mt-2 text-sm text-gray-600">
          📍 {vendor.area && `${vendor.area}, `}{vendor.city}
        </div>

        {vendor.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {vendor.description}
          </p>
        )}

        <button
          onClick={handleSendRequest}
          disabled={status === "sending" || status === "sent"}
          className={`mt-4 w-full py-2 rounded-lg transition font-medium ${
            status === "sent"
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : status === "sending"
              ? "bg-green-400 text-white cursor-wait"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {status === "sending" && "Sending..."}
          {status === "sent" && "Request Sent ✓"}
          {status === "idle" && "Send Request"}
          {status === "error" && "Send Request"}
        </button>
      </div>
    </div>
  );
}