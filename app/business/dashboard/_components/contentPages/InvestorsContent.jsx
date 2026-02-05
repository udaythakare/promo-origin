"use client";

import { useEffect, useState } from "react";
import { getAllInvestorsForVendor } from "../../../../actions/investors/getAllInvestorsForVendor.js";
import { sendVendorRequest } from "../../../../actions/investors/sendVendorRequest.js";
import { getUserId } from "../../../../../helpers/userHelper.js";

export default function InvestorsContent() {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const id = await getUserId();
      if (!id || id?.msg) return;

      setVendorId(id);
      const data = await getAllInvestorsForVendor(id);
      setInvestors(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSendRequest = async (investorId) => {
    setInvestors(prev =>
      prev.map(i =>
        i.user_id === investorId ? { ...i, status: "pending" } : i
      )
    );

    await sendVendorRequest({
      investorId,
      vendorUserId: vendorId,
    });
  };

  if (loading) return <p>Loading investors...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">All Investors</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {investors.map(inv => (
          <div key={inv.user_id} className="bg-white p-5 rounded-xl border">
            <h3 className="font-semibold">{inv.full_name}</h3>
            <p className="text-sm text-gray-500">{inv.city}</p>

            <button
              onClick={() => handleSendRequest(inv.user_id)}
              className="mt-4 w-full bg-black text-white py-2 rounded"
            >
              Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
