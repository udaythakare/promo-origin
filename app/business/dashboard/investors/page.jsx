import { getVendorConnections } from "@/app/actions/vendor/getVendorConnections";
import VendorInvestorsClient from "./VendorInvestorsClient";

export default async function VendorInvestorsPage() {
  const data = await getVendorConnections();

  if (!data.success) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Failed to load connections.
      </div>
    );
  }

  const { incoming, sentByVendor, accepted, rejected } = data;

  return (
    <VendorInvestorsClient
      incoming={incoming}
      sentByVendor={sentByVendor}
      accepted={accepted}
      rejected={rejected}
    />
  );
}