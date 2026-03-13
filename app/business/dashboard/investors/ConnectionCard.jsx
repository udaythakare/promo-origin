"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { respondToConnection } from "@/app/actions/vendor/respondToConnection";
import { useLanguage } from "@/context/LanguageContext";

export default function ConnectionCard({ connection, type }) {
  const router = useRouter();
  const ctx = useLanguage();
  const t = ctx?.t;

  const [loading, setLoading] = useState(null);
  const [cardStatus, setCardStatus] = useState(type);

  const investor = connection.investor;
  const profile = connection.investor_profile;

  const handleRespond = async (action) => {
    try {
      setLoading(action);
      const res = await respondToConnection({
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

        {/* LEFT — Investor Info */}
        <div className="space-y-1">
          <p className="font-bold text-gray-900 text-base">
            {investor?.full_name || "Unknown Investor"}
          </p>
          <p className="text-sm text-gray-500">
            {investor?.email}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {profile?.city && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                📍 {profile.city}
              </span>
            )}
            {profile?.investment_type && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                {profile.investment_type}
              </span>
            )}
            {profile?.risk_appetite && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-200">
                {profile.risk_appetite} {t?.investors?.risk ?? "risk"}
              </span>
            )}
            {profile?.investment_range_min && profile?.investment_range_max && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
                ₹{Number(profile.investment_range_min).toLocaleString("en-IN")} –
                ₹{Number(profile.investment_range_max).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-1">
            {t?.investors?.requested ?? "Requested"}{" "}
            {new Date(connection.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {cardStatus === "incoming" && (
            <>
              <button
                onClick={() => handleRespond("rejected")}
                disabled={loading !== null}
                className="px-4 py-2 text-sm font-bold rounded-lg border-2 border-black text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
              >
                {loading === "rejected"
                  ? "..."
                  : t?.investors?.decline ?? "Decline"}
              </button>
              <button
                onClick={() => handleRespond("accepted")}
                disabled={loading !== null}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-[#df6824] text-white border-2 border-black hover:bg-orange-600 transition disabled:opacity-50"
              >
                {loading === "accepted"
                  ? "..."
                  : t?.investors?.accept ?? "Accept"}
              </button>
            </>
          )}

          {cardStatus === "accepted" && (
            <button
              onClick={() =>
                router.push(`/business/dashboard/messages/${connection.id}`)
              }
              className="px-4 py-2 text-sm font-bold rounded-lg bg-green-600 text-white border-2 border-black hover:bg-green-700 transition"
            >
              {t?.investors?.openChat ?? "Open Chat"}
            </button>
          )}

          {cardStatus === "sent" && (
            <span className="px-4 py-2 text-sm font-bold rounded-lg bg-gray-100 text-gray-500 border-2 border-black">
              {t?.investors?.awaitingResponse ?? "Awaiting Response"}
            </span>
          )}

          {cardStatus === "rejected" && (
            <span className="px-4 py-2 text-sm font-bold rounded-lg bg-red-50 text-red-500 border-2 border-black">
              {t?.investors?.declined ?? "Declined"}
            </span>
          )}

        </div>
      </div>
    </div>
  );
}