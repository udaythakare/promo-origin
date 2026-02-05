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
  const [investments, setInvestments] = useState(initialInvestments);
  const [stats, setStats] = useState(initialStats);

  function handleInvestmentCreated(newInvestment) {
    /* 1️⃣ Update investments list */
    setInvestments((prev) => [newInvestment, ...prev]);

    /* 2️⃣ Update stats optimistically */
    setStats((prev) => ({
      ...prev,
      totalInvested: prev.totalInvested + Number(newInvestment.amount),
      totalInvestments: prev.totalInvestments + 1,
      activeInvestments: prev.activeInvestments + 1,
    }));
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Investments</h1>
          <p className="text-gray-500">
            Track and manage your vendor investments
          </p>
        </div>

        <CreateInvestmentClient
          vendors={vendors}
          onCreated={handleInvestmentCreated}
        />
      </div>

      {/* Stats */}
      <InvestmentStats stats={stats} />

      {/* Table */}
      <InvestmentsTable investments={investments} />
    </div>
  );
}
