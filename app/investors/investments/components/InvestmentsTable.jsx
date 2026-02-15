"use client";

import { useState } from "react";
import CompleteInvestmentModal from "./CompleteInvestmentModal";

export default function InvestmentsTable({
  investments = [],
  onCompleted,
}) {
  const [selected, setSelected] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="p-4 font-semibold">Business</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">ROI %</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {investments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  No investments found.
                </td>
              </tr>
            )}

            {investments.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">
                  {inv.businesses?.name || "Unknown Business"}
                </td>

                <td className="p-4">{formatCurrency(inv.amount)}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      inv.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>

                <td className="p-4">
                  {inv.roi_percentage ?? "-"}
                </td>

                <td className="p-4 text-right">
                  {inv.status === "active" && (
                    <button
                      onClick={() => setSelected(inv)}
                      className="text-green-600 hover:text-green-800 font-semibold transition"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        {investments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No investments found.
          </div>
        )}

        {investments.map((inv) => (
          <div
            key={inv.id}
            className="bg-white border rounded-xl p-4 shadow-sm space-y-3"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {inv.businesses?.name || "Unknown Business"}
              </h3>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  inv.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {inv.status}
              </span>
            </div>

            <p className="text-sm">
              <strong>Amount:</strong> {formatCurrency(inv.amount)}
            </p>

            <p className="text-sm">
              <strong>ROI %:</strong> {inv.roi_percentage ?? "-"}
            </p>

            {inv.status === "active" && (
              <button
                onClick={() => setSelected(inv)}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Complete Investment
              </button>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <CompleteInvestmentModal
          investment={selected}
          onClose={() => setSelected(null)}
          onCompleted={(updated) => {
            setSelected(null);
            onCompleted?.(updated);
          }}
        />
      )}
    </>
  );
}
