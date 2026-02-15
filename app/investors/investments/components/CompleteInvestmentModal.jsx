"use client";

import { useState } from "react";
import { completeInvestment } from "@/app/actions/investors/completeInvestment";

export default function CompleteInvestmentModal({
  investment,
  onClose,
  onCompleted,
}) {
  const [roi, setRoi] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    try {
      setLoading(true);

      const result = await completeInvestment({
        investmentId: investment.id,
        roiPercentage: Number(roi),
      });

      onCompleted?.(result);
    } catch (error) {
      console.error(error);
      alert("Failed to complete investment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">
          Complete Investment
        </h2>

        <p className="text-sm text-gray-600">
          Business: {investment.businesses?.name}
        </p>

        <input
          type="number"
          placeholder="Enter ROI %"
          value={roi}
          onChange={(e) => setRoi(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleComplete}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            {loading ? "Completing..." : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
