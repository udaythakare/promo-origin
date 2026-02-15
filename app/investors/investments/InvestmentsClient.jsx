"use client";

import { useState } from "react";
import InvestmentStats from "./components/InvestmentStats";
import InvestmentsTable from "./components/InvestmentsTable";
import CreateInvestmentClient from "./CreateInvestmentClient";

export default function InvestmentsClient({
  initialInvestments,
  initialStats,
  vendors,
}) {
  const [investments, setInvestments] = useState(initialInvestments || []);
  const [stats, setStats] = useState(initialStats || {});

  /* ================= HANDLE NEW INVESTMENT ================= */
  function handleInvestmentCreated(newInvestment) {
    // Update investments list
    setInvestments((prev) => [newInvestment, ...(prev || [])]);

    // Update stats safely
    setStats((prev) => ({
      ...prev,
      totalInvested:
        Number(prev?.totalInvested || 0) +
        Number(newInvestment?.amount || 0),
      totalInvestments: Number(prev?.totalInvestments || 0) + 1,
      activeInvestments: Number(prev?.activeInvestments || 0) + 1,
    }));
  }

  return (
    <div className="space-y-10">

      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* Left Content */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Investments
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Track and manage your vendor investments portfolio
            </p>
          </div>

          {/* Right Action */}
          <CreateInvestmentClient
            vendors={vendors}
            onCreated={handleInvestmentCreated}
          />
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      <div>
        <InvestmentStats stats={stats} />
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">
        <InvestmentsTable investments={investments} />
      </div>

    </div>
  );
}
