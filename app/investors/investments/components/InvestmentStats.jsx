export default function InvestmentStats({ stats }) {
  const totalInvested = stats?.totalInvested ?? 0;
  const totalInvestments = stats?.totalInvestments ?? 0;
  const activeInvestments = stats?.activeInvestments ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded">
        <p className="text-sm text-gray-500">Total Invested</p>
        <p className="text-xl font-semibold">
          ₹ {totalInvested.toLocaleString()}
        </p>
      </div>

      <div className="p-4 border rounded">
        <p className="text-sm text-gray-500">Total Investments</p>
        <p className="text-xl font-semibold">
          {totalInvestments}
        </p>
      </div>

      <div className="p-4 border rounded">
        <p className="text-sm text-gray-500">Active Investments</p>
        <p className="text-xl font-semibold">
          {activeInvestments}
        </p>
      </div>
    </div>
  );
}
