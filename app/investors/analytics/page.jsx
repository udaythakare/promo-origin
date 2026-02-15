"use client";

import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import ChartPlaceholder from "../components/ChartPlaceholder";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/investors/analytics");
        const data = await res.json();

        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">No analytics data available</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Investor Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Investments" value={analytics.totalInvestments} />
        <StatCard title="Total Amount Invested" value={`₹${analytics.totalAmount}`} />
        <StatCard title="Active Investments" value={analytics.activeInvestments} />
        <StatCard title="Completed Investments" value={analytics.completedInvestments} />
        <StatCard title="Total Connections" value={analytics.totalConnections} />
        <StatCard title="Pending Requests" value={analytics.pendingRequests} />
      </div>

      <ChartPlaceholder />
    </div>
  );
}
