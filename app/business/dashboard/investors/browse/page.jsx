import { getInvestors } from "@/app/actions/vendor/getInvestors";
import { getUserId } from "@/helpers/userHelper";
import { redirect } from "next/navigation";
import InvestorCard from "./InvestorCard";

export default async function BrowseInvestorsPage() {

  const userId = await getUserId();
  if (!userId || userId?.msg) redirect("/login");

  const result = await getInvestors();

  if (!result.success) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Failed to load investors.
      </div>
    );
  }

  const { investors } = result;

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Browse Investors
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Find investors and send them a connection request
        </p>
      </div>

      {investors.length === 0 ? (
        <p className="text-gray-400 text-sm border-2 border-dashed rounded-xl p-10 text-center">
          No investors available right now
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor) => (
            <InvestorCard
              key={investor.id}
              investor={investor}
            />
          ))}
        </div>
      )}

    </div>
  );
}