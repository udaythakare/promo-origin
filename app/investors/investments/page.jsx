import { getInvestorInvestments } from "../../actions/investors/getInvestorInvestments";
import { getInvestmentStats } from "../../actions/investors/getInvestmentStats";
import { getVendors } from "../../actions/investors/getVendors";

import InvestmentsClient from "./InvestmentsClient";

export const dynamic = "force-dynamic";

export default async function InvestmentsPage() {
  const investments = await getInvestorInvestments();
  const stats = await getInvestmentStats();
  const vendors = await getVendors();

  return (
    <InvestmentsClient
      initialInvestments={investments}
      initialStats={stats}
      vendors={vendors}
    />
  );
}
