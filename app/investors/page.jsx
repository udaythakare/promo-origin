import StatCard from "./components/StatCard";
import ChartPlaceholder from "./components/ChartPlaceholder";
import { getDashboardStats } from "../actions/investors/getDashboardStats";

export const dynamic = "force-dynamic";

export default async function InvestorDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>

      {/* Header */}
      <h1 className="text-2xl font-bold mb-1">
        Welcome Back, Investor
      </h1>
      <p className="text-gray-500 mb-6">
        Here's what's happening with your investments today
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total Investments"
          value={stats.totalInvestments}
          change="Coming soon"
          icon={<span className="text-green-600 font-bold">$</span>}
        />

        <StatCard
          title="Vendors Monitored"
          value={stats.vendorsMonitored}
          change={stats.vendorsMonitored === "0" ? "No vendors yet" : `${stats.vendorsMonitored} active`}
          icon={<span className="text-green-600 font-bold">🏪</span>}
        />

        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          change={stats.pendingRequests === "0" ? "All clear" : "Needs attention"}
          icon={<span className="text-green-600 font-bold">⏳</span>}
        />

        <StatCard
          title="Average ROI"
          value={stats.avgROI}
          change="Coming soon"
          icon={<span className="text-green-600 font-bold">📈</span>}
        />

      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Investment Growth Over Time
        </h2>

        <ChartPlaceholder />
      </div>

    </div>
  );
}