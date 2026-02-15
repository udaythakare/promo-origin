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
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/investors/analytics", {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load analytics");
          return;
        }

        setAnalytics(data.analytics);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        No analytics data available
      </div>
    );
  }

  // ================= FORMATTERS =================

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  // ================= CHART DATA =================

  const statusData = [
    { name: "Active", value: analytics.activeInvestments || 0 },
    { name: "Completed", value: analytics.completedInvestments || 0 },
  ];

  const pieData = [
    { name: "Active", value: analytics.activeInvestments || 0 },
    { name: "Completed", value: analytics.completedInvestments || 0 },
  ];

  const monthlyGrowth =
    analytics.monthlyGrowth && analytics.monthlyGrowth.length > 0
      ? analytics.monthlyGrowth
      : [{ month: "No Data", amount: 0 }];

  const COLORS = ["#10B981", "#6366F1"];

  return (
    <div className="p-6 space-y-12">

      <h1 className="text-3xl font-bold">
        Investor Analytics
      </h1>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Investments" value={analytics.totalInvestments} />
        <StatCard title="Total Amount Invested" value={formatCurrency(analytics.totalAmount)} />
        <StatCard title="Total Profit Earned" value={formatCurrency(analytics.totalProfit)} />
        <StatCard title="Overall ROI %" value={`${analytics.overallROI}%`} />
        <StatCard title="Active Investments" value={analytics.activeInvestments} />
        <StatCard title="Completed Investments" value={analytics.completedInvestments} />
        <StatCard title="Total Connections" value={analytics.totalConnections} />
        <StatCard title="Pending Requests" value={analytics.pendingRequests} />
      </div>

      {/* ================= BAR + PIE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">
            Investment Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#16A34A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">
            Active vs Completed
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ================= LINE CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">
          Investment Growth Trend
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#6366F1"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

