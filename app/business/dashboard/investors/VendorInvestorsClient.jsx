'use client';

import { useLanguage } from "@/context/LanguageContext";
import ConnectionCard from "./ConnectionCard";

export default function VendorInvestorsClient({ incoming, sentByVendor, accepted, rejected }) {

  const { t } = useLanguage();
  const inv = t?.investors;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          {inv?.connections || "Investor Connections"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {inv?.browseToConnect || "Manage your investor requests and active connections"}
        </p>
      </div>

      {/* INCOMING REQUESTS */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">
            {inv?.requested || "Incoming Requests"}
          </h2>
          {incoming.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-600 border border-orange-300">
              {incoming.length}
            </span>
          )}
        </div>

        {incoming.length === 0 ? (
          <p className="text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            {inv?.noConnections || "No pending requests from investors"}
          </p>
        ) : (
          <div className="space-y-4">
            {incoming.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} type="incoming" />
            ))}
          </div>
        )}
      </section>

      {/* ACTIVE CONNECTIONS */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">
            {inv?.openChat || "Active Connections"}
          </h2>
          {accepted.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-600 border border-green-300">
              {accepted.length}
            </span>
          )}
        </div>

        {accepted.length === 0 ? (
          <p className="text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
            {inv?.noConnections || "No active connections yet"}
          </p>
        ) : (
          <div className="space-y-4">
            {accepted.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} type="accepted" />
            ))}
          </div>
        )}
      </section>

      {/* REQUESTS SENT BY VENDOR */}
      {sentByVendor.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-4">
            {inv?.awaitingResponse || "Requests You Sent"}
          </h2>
          <div className="space-y-4">
            {sentByVendor.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} type="sent" />
            ))}
          </div>
        </section>
      )}

      {/* REJECTED */}
      {rejected.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-4">
            {inv?.declined || "Declined"}
          </h2>
          <div className="space-y-4">
            {rejected.map((conn) => (
              <ConnectionCard key={conn.id} connection={conn} type="rejected" />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}