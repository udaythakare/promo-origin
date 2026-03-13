import { getInvestorConnections } from "@/app/actions/investors/getInvestorConnections";
import { getUserId } from "@/helpers/userHelper";
import { redirect } from "next/navigation";
import InvestorConnectionCard from "./InvestorConnectionCard";

export default async function InvestorConnectionsPage() {

  const userId = await getUserId();
  if (!userId || userId?.msg) redirect("/login");

  const data = await getInvestorConnections();

  if (!data.success) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Failed to load connections.
      </div>
    );
  }

  const { incoming, outgoing, accepted, rejected } = data;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Connections
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your vendor connection requests
        </p>
      </div>

      {/* Incoming from vendors */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-black text-gray-800 uppercase">
            Requests From Vendors
          </h2>
          {incoming.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
              {incoming.length}
            </span>
          )}
        </div>

        {incoming.length === 0 ? (
          <p className="text-sm text-gray-400 border-2 border-dashed rounded-xl p-6 text-center">
            No pending requests from vendors
          </p>
        ) : (
          <div className="space-y-4">
            {incoming.map((conn) => (
              <InvestorConnectionCard
                key={conn.id}
                connection={conn}
                type="incoming"
              />
            ))}
          </div>
        )}
      </section>

      {/* Active connections */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-black text-gray-800 uppercase">
            Active Connections
          </h2>
          {accepted.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-700 border border-green-300">
              {accepted.length}
            </span>
          )}
        </div>

        {accepted.length === 0 ? (
          <p className="text-sm text-gray-400 border-2 border-dashed rounded-xl p-6 text-center">
            No active connections yet
          </p>
        ) : (
          <div className="space-y-4">
            {accepted.map((conn) => (
              <InvestorConnectionCard
                key={conn.id}
                connection={conn}
                type="accepted"
              />
            ))}
          </div>
        )}
      </section>

      {/* Sent by investor — waiting */}
      {outgoing.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-800 uppercase mb-4">
            Requests You Sent
          </h2>
          <div className="space-y-4">
            {outgoing.map((conn) => (
              <InvestorConnectionCard
                key={conn.id}
                connection={conn}
                type="sent"
              />
            ))}
          </div>
        </section>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-800 uppercase mb-4">
            Declined
          </h2>
          <div className="space-y-4">
            {rejected.map((conn) => (
              <InvestorConnectionCard
                key={conn.id}
                connection={conn}
                type="rejected"
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}