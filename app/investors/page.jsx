import { getInvestorInvestments } from "../actions/investors/getInvestorInvestments";
import { getUserId } from "../../helpers/userHelper";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InvestorDashboard() {
  const userId = await getUserId();

  if (!userId || userId?.msg) {
    throw new Error("Unauthorized");
  }

  const investments = await getInvestorInvestments(userId);

  // =========================
  // CALCULATIONS
  // =========================

  const totalInvestments = investments.length;

  const totalAmount = investments.reduce(
    (sum, inv) => sum + Number(inv.amount || 0),
    0
  );

  const totalProfit = investments.reduce((sum, inv) => {
    const profit =
      (Number(inv.amount || 0) * Number(inv.roi_percentage || 0)) / 100;
    return sum + profit;
  }, 0);

  const activeInvestments = investments.filter(
    (inv) => inv.status === "active"
  ).length;

  const completedInvestments = investments.filter(
    (inv) => inv.status === "completed"
  ).length;

  const overallROI =
    totalAmount > 0
      ? ((totalProfit / totalAmount) * 100).toFixed(2)
      : 0;

  // Recent 5
  const recentInvestments = investments.slice(0, 5);

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Investor Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your investment portfolio
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <SummaryCard
          title="Total Invested"
          value={`₹${totalAmount.toLocaleString()}`}
        />

        <SummaryCard
          title="Total Profit"
          value={`₹${totalProfit.toLocaleString()}`}
        />

        <SummaryCard
          title="Overall ROI"
          value={`${overallROI}%`}
        />

        <SummaryCard
          title="Active Investments"
          value={activeInvestments}
        />

      </div>

      {/* ================= STATUS OVERVIEW ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold mb-4">
            Investment Status
          </h2>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Active</span>
            <span>{activeInvestments}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Completed</span>
            <span>{completedInvestments}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h2 className="text-lg font-semibold mb-4">
            Portfolio Insights
          </h2>

          <p className="text-sm text-gray-600">
            You currently have{" "}
            <span className="font-semibold text-gray-900">
              {totalInvestments}
            </span>{" "}
            total investments across multiple businesses.
          </p>
        </div>

      </div>

      {/* ================= RECENT INVESTMENTS ================= */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Recent Investments
          </h2>

          <Link
            href="/investors/investments"
            className="text-sm text-green-600 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-6 py-3">Business</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">ROI %</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvestments.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    {inv.businesses?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4">
                    ₹{Number(inv.amount).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {inv.roi_percentage}%
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inv.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(inv.invested_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {recentInvestments.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500"
                  >
                    No investments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* ===========================
   REUSABLE SUMMARY CARD
=========================== */

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-2xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
