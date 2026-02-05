"use client";

import { useState } from "react";
import CreateInvestmentModal from "../../components/CreateInvestmentModal";


export default function InvestmentsTable({ investments, onCompleted }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Business</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            <th className="p-2">ROI</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id} className="border-t">
              <td className="p-2">{inv.businesses?.name}</td>
              <td className="p-2">₹{inv.amount}</td>
              <td className="p-2">{inv.status}</td>
              <td className="p-2">
                {inv.roi_percentage ?? "-"}
              </td>
              <td className="p-2">
                {inv.status === "active" && (
                  <button
                    onClick={() => setSelected(inv)}
                    className="text-green-600 underline"
                  >
                    Complete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <CompleteInvestmentModal
          investment={selected}
          onClose={() => setSelected(null)}
          onCompleted={onCompleted}
        />
      )}
    </>
  );
}
