import { getInvestors } from "@/app/actions/vendor/getInvestors";
import { getUserId } from "@/helpers/userHelper";
import { redirect } from "next/navigation";
import BrowseInvestorsClient from "./BrowseInvestorsClient";

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

  return <BrowseInvestorsClient investors={result.investors} />;
}