"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { respondToVendorRequest } from "@/app/actions/investors/respondToVendorRequest";

export default function InvestorConnectionCard({ connection, type }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [cardStatus, setCardStatus] = useState(type);

  const vendor = connection.vendor;

  const handleRespond = async (action) => {
    try {
      setLoading(action);
      const res = await respondToVendorRequest({
        connectionId: connection.id,
        action,
      });

      if (res.success) {
        setCardStatus(action === "accepted" ? "accepted" : "rejected");
        router.refresh();
      } else {
        console.error(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Left — Vendor Info */}
        <div className="space-y-1">
          <p className="font-black text-gray-900 text-base">
            {vendor?.business_name || vendor?.full_name || "Unknown Vendor"}
          </p>
          <p className="text-sm text-gray-500">
            {vendor?.email}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Requested {new Date(connection.created_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {cardStatus === "incoming" && (
            <>
              <button
                onClick={() => handleRespond("rejected")}
                disabled={loading !== null}
                className="px-4 py-2 text-sm font-black rounded-lg border-2 border-black text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                {loading === "rejected" ? "..." : "Decline"}
              </button>
              <button
                onClick={() => handleRespond("accepted")}
                disabled={loading !== null}
                className="px-4 py-2 text-sm font-black rounded-lg bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300 transition disabled:opacity-50 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
              >
                {loading === "accepted" ? "..." : "Accept"}
              </button>
            </>
          )}

          {cardStatus === "accepted" && (
            <button
              onClick={() => router.push(`/investors/messages/${connection.id}`)}
              className="px-4 py-2 text-sm font-black rounded-lg bg-green-600 text-white border-2 border-black hover:bg-green-700 transition shadow-[3px_3px_0px_rgba(0,0,0,1)]"
            >
              Open Chat
            </button>
          )}

          {cardStatus === "sent" && (
            <span className="px-4 py-2 text-sm font-black rounded-lg bg-gray-100 text-gray-500 border-2 border-black">
              Awaiting Response
            </span>
          )}

          {cardStatus === "rejected" && (
            <span className="px-4 py-2 text-sm font-black rounded-lg bg-red-50 text-red-500 border-2 border-black">
              Declined
            </span>
          )}

        </div>
      </div>
    </div>
  );
}