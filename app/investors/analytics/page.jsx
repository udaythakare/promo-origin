"use client";

import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function AnalyticsPage() {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    async function fetchAnalytics() {
      try {

        const res = await fetch("/api/investors/analytics", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load analytics");
        }

        setAnalytics(data.analytics || {});

      } catch (err) {

        console.error("Analytics error:", err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();

  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e1e4ea]">
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e1e4ea] text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  /* ---------------- SAFE DATA ---------------- */

  const totalInvestments = analytics?.totalInvestments || 0;
  const totalAmount = analytics?.totalAmount || 0;
  const totalProfit = analytics?.totalProfit || 0;
  const overallROI = analytics?.overallROI || 0;
  const activeInvestments = analytics?.activeInvestments || 0;
  const completedInvestments = analytics?.completedInvestments || 0;
  const totalConnections = analytics?.totalConnections || 0;
  const pendingRequests = analytics?.pendingRequests || 0;

  const monthlyGrowth =
    analytics?.monthlyGrowth?.length > 0
      ? analytics.monthlyGrowth
      : [{ month: "No Data", amount: 0 }];

  const statusData = [
    { name: "Active", value: activeInvestments },
    { name: "Completed", value: completedInvestments },
  ];

  const COLORS = ["#1a6559", "#8bc7bc"];

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <section className="bg-[#e1e4ea] text-[#0d254b] min-h-screen p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Investor Analytics
        </h1>
        <p className="text-sm opacity-70">
          Real-time investment insights
        </p>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <StatCard title="Total Investments" value={totalInvestments} />
        <StatCard title="Total Amount Invested" value={formatCurrency(totalAmount)} />
        <StatCard title="Total Profit Earned" value={formatCurrency(totalProfit)} />
        <StatCard title="Overall ROI %" value={`${overallROI}%`} />

        <StatCard title="Active Investments" value={activeInvestments} />
        <StatCard title="Completed Investments" value={completedInvestments} />
        <StatCard title="Total Connections" value={totalConnections} />
        <StatCard title="Pending Requests" value={pendingRequests} />

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* BAR CHART */}

        <div className="bg-white rounded-xl p-4 shadow-md">

          <h2 className="font-semibold mb-3">
            Investment Status Overview
          </h2>

          <div className="h-[260px] w-full">

            <ResponsiveContainer>

              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#0d254b" />
                <YAxis stroke="#0d254b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1a6559" radius={[4,4,0,0]} />
              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* PIE CHART */}

        <div className="bg-white rounded-xl p-4 shadow-md">

          <h2 className="font-semibold mb-3">
            Active vs Completed
          </h2>

          <div className="h-[260px] w-full">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* LINE CHART */}

      <div className="bg-white rounded-xl p-4 shadow-md mt-4">

        <h2 className="font-semibold mb-3">
          Investment Growth Trend
        </h2>

        <div className="h-[300px] w-full">

          <ResponsiveContainer>

            <LineChart data={monthlyGrowth}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#0d254b" />
              <YAxis stroke="#0d254b" />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="amount"
                stroke="#1a6559"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </section>
  );
}