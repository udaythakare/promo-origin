import { getInvestorConnections } from "@/app/actions/investors/getInvestorConnections";
import { getUserId } from "@/helpers/userHelper";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function InvestorMessagesPage() {

  const userId = await getUserId();
  if (!userId || userId?.msg) redirect("/login");

  const data = await getInvestorConnections();

  if (!data.success) {
    return (
      <div className="p-6 text-red-500 font-bold">
        Failed to load messages.
      </div>
    );
  }

  const { accepted } = data;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your active investment conversations
        </p>
      </div>

      {accepted.length === 0 ? (
        <div className="text-center border-2 border-dashed border-gray-200 rounded-xl p-12">
          <p className="text-gray-400 font-bold text-sm">
            No active conversations yet
          </p>
          <p className="text-gray-300 text-xs mt-1">
            Connect with a vendor to start chatting
          </p>
          <Link
            href="/investors/vendors"
            className="inline-block mt-4 px-6 py-2 bg-yellow-400 text-black font-black text-sm border-2 border-black rounded-lg shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 transition"
          >
            Browse Vendors
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {accepted.map((conn) => (
            <Link
              key={conn.id}
              href={`/investors/messages/${conn.id}`}
              className="flex items-center gap-4 p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center font-black text-lg text-black flex-shrink-0">
                {conn.vendor?.business_name?.charAt(0)?.toUpperCase() ||
                  conn.vendor?.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm truncate">
                  {conn.vendor?.business_name || conn.vendor?.full_name || "Vendor"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Connected {new Date(conn.accepted_at).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>

              {/* Arrow */}
              <div className="text-yellow-500 font-black text-xl flex-shrink-0">
                &#8594;
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}