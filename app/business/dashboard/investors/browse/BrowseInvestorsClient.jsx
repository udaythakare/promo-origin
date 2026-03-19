'use client';

import { useLanguage } from "@/context/LanguageContext";
import InvestorCard from "./InvestorCard";

export default function BrowseInvestorsClient({ investors }) {
  const { t } = useLanguage();
  const inv = t?.investors;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          {inv?.browseTitle || "Browse Investors"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {inv?.browseToConnect || "Find investors and send them a connection request"}
        </p>
      </div>

      {investors.length === 0 ? (
        <p className="text-gray-400 text-sm border-2 border-dashed rounded-xl p-10 text-center">
          {inv?.noInvestors || "No investors available right now"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>
      )}
    </div>
  );
}