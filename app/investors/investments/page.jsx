import { getInvestorInvestments } from "../../actions/investors/getInvestorInvestments";
import { getInvestmentStats } from "../../actions/investors/getInvestmentStats";
import { getVendors } from "../../actions/investors/getVendors";
import { getUserId } from "../../../helpers/userHelper";

import InvestmentsClient from "./InvestmentsClient";

export const dynamic = "force-dynamic";

export default async function InvestmentsPage() {
  const userId = await getUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const investments = await getInvestorInvestments(userId);
  const stats = await getInvestmentStats(userId);
  const vendors = await getVendors(userId);

  return (
    <InvestmentsClient
      initialInvestments={investments}
      initialStats={stats}
      vendors={vendors}
    />
  );
}
