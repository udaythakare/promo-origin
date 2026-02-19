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
        <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
          Investor Dashboard
        </h1>
        <p className="text-gray-600 mt-1 font-bold">
          Overview of your investment portfolio
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

        <SummaryCard
          title="Total Invested"
          value={`₹${totalAmount.toLocaleString()}`}
          accent="bg-yellow-400"
        />

        <SummaryCard
          title="Total Profit"
          value={`₹${totalProfit.toLocaleString()}`}
          accent="bg-yellow-200"
        />

        <SummaryCard
          title="Overall ROI"
          value={`${overallROI}%`}
          accent="bg-yellow-400"
        />

        <SummaryCard
          title="Active Investments"
          value={activeInvestments}
          accent="bg-yellow-200"
        />

      </div>

      {/* ================= STATUS OVERVIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">

        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <h2 className="text-lg font-black uppercase mb-4">
            Investment Status
          </h2>

          <div className="flex justify-between text-sm font-bold text-gray-700 mb-3 pb-3 border-b-2 border-black">
            <span>Active</span>
            <span className="bg-yellow-400 px-3 py-1 border-2 border-black font-black">{activeInvestments}</span>
          </div>

          <div className="flex justify-between text-sm font-bold text-gray-700">
            <span>Completed</span>
            <span className="bg-gray-200 px-3 py-1 border-2 border-black font-black">{completedInvestments}</span>
          </div>
        </div>

        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
          <h2 className="text-lg font-black uppercase mb-4">
            Portfolio Insights
          </h2>

          <p className="text-sm text-gray-700 font-bold">
            You currently have{" "}
            <span className="bg-yellow-400 px-2 py-0.5 border-2 border-black font-black">
              {totalInvestments}
            </span>{" "}
            total investments across multiple businesses.
          </p>
        </div>

      </div>

      {/* ================= RECENT INVESTMENTS ================= */}
      <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-4 border-black flex justify-between items-center bg-yellow-200">
          <h2 className="text-lg font-black uppercase">
            Recent Investments
          </h2>

          <Link
            href="/investors/investments"
            className="text-sm font-bold bg-black text-yellow-400 px-4 py-2 border-2 border-black hover:bg-gray-900 transition-colors uppercase"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b-2 border-black">
              <tr>
                <th className="text-left px-6 py-3 font-black uppercase text-xs">Business</th>
                <th className="text-left px-6 py-3 font-black uppercase text-xs">Amount</th>
                <th className="text-left px-6 py-3 font-black uppercase text-xs">ROI %</th>
                <th className="text-left px-6 py-3 font-black uppercase text-xs">Status</th>
                <th className="text-left px-6 py-3 font-black uppercase text-xs">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInvestments.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold">
                    {inv.businesses?.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 font-bold">
                    ₹{Number(inv.amount).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 font-bold">
                    {inv.roi_percentage}%
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-black uppercase border-2 border-black ${inv.status === "active"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-200 text-black"
                        }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-bold">
                    {new Date(inv.invested_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {recentInvestments.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 font-bold"
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

function SummaryCard({ title, value, accent = "bg-yellow-400" }) {
  return (
    <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
      <p className="text-sm text-gray-600 mb-2 font-bold uppercase tracking-wide">{title}</p>
      <p className={`text-xl sm:text-2xl font-black text-black inline-block ${accent} px-2 py-1 border-2 border-black`}>
        {value}
      </p>
    </div>
  );
}
