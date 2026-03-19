"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendInvestorRequest } from "@/app/actions/vendor/sendInvestorRequest";
import { useLanguage } from "@/context/LanguageContext";

export default function InvestorCard({ investor }) {
  const router = useRouter();
  const [status, setStatus] = useState(investor.connection?.status || "none");
  const [connectionId, setConnectionId] = useState(investor.connection?.id || null);
  const [loading, setLoading] = useState(false);

  const { t } = useLanguage();
  const inv = t?.investors;

  const handleRequest = async () => {
    try {
      setLoading(true);
      setStatus("pending");

      const res = await sendInvestorRequest({
        investorUserId: investor.user_id,
      });

      if (res.success) {
        setStatus("pending");
        setConnectionId(res.connectionId);
      } else {
        setStatus(res.status || "none");
        setConnectionId(res.connectionId || null);
      }
    } catch (err) {
      console.error(err);
      setStatus("none");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-xl p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-4">

      {/* Top — Investor Info */}
      <div className="space-y-2">

        {/* Name + type badge */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-black text-gray-900 leading-tight">
            {investor.full_name}
          </h2>
          {investor.profile_type && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 whitespace-nowrap font-bold">
              {investor.profile_type === "individual"
                ? (inv?.individual || investor.profile_type)
                : investor.profile_type === "company"
                ? (inv?.company || investor.profile_type)
                : investor.profile_type}
            </span>
          )}
        </div>

        {/* Company name */}
        {investor.company_name && (
          <p className="text-sm text-gray-600 font-medium">
            {investor.company_name}
          </p>
        )}

        {/* Location */}
        {investor.city && (
          <p className="text-sm text-gray-500">
            📍 {investor.city}{investor.country ? `, ${investor.country}` : ""}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {investor.investment_type && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-bold">
              {investor.investment_type}
            </span>
          )}
          {investor.risk_appetite && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-bold">
              {investor.risk_appetite === "low"
                ? (inv?.low || investor.risk_appetite)
                : investor.risk_appetite === "medium"
                ? (inv?.medium || investor.risk_appetite)
                : investor.risk_appetite === "high"
                ? (inv?.high || investor.risk_appetite)
                : investor.risk_appetite} {inv?.risk || "risk"}
            </span>
          )}
          {investor.investment_range_min && investor.investment_range_max && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-bold">
              ₹{Number(investor.investment_range_min).toLocaleString("en-IN")} –
              ₹{Number(investor.investment_range_max).toLocaleString("en-IN")}
            </span>
          )}
        </div>

      </div>

      {/* Divider */}
      <div className="border-t-2 border-black" />

      {/* Action Button */}
      <div>
        {status === "accepted" && connectionId ? (
          <button
            onClick={() => router.push(`/business/dashboard/messages/${connectionId}`)}
            className="w-full py-2 text-sm font-black rounded-lg bg-green-600 text-white border-2 border-black hover:bg-green-700 transition shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            {inv?.openChat || "Open Chat"}
          </button>
        ) : status === "pending" ? (
          <button
            disabled
            className="w-full py-2 text-sm font-black rounded-lg bg-gray-200 text-gray-600 border-2 border-black cursor-not-allowed"
          >
            {inv?.requested || "Request Sent"}
          </button>
        ) : status === "rejected" ? (
          <button
            disabled
            className="w-full py-2 text-sm font-black rounded-lg bg-red-50 text-red-500 border-2 border-black cursor-not-allowed"
          >
            {inv?.declined || "Request Declined"}
          </button>
        ) : (
          <button
            onClick={handleRequest}
            disabled={loading}
            className="w-full py-2 text-sm font-black rounded-lg bg-[#df6824] text-white border-2 border-black hover:bg-orange-600 transition disabled:opacity-50 shadow-[3px_3px_0px_rgba(0,0,0,1)]"
          >
            {loading ? (t?.common?.loading || "Sending...") : (inv?.sendRequest || "Send Request")}
          </button>
        )}
      </div>

    </div>
  );
}