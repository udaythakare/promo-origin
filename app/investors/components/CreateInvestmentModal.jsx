"use client";

import { useState, useEffect } from "react";
import { createInvestment } from "../../actions/investors/createInvestment";


export default function CreateInvestmentModal({
  vendors = [],
  onClose,
  onCreated,
}) {
  /* ================= STATE ================= */
  const [businessId, setBusinessId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= CLOSE ON ESC ================= */
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ================= SUBMIT HANDLER ================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!businessId || !amount) {
      setError("Please select a vendor and enter amount");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const newInvestment = await createInvestment({
        businessId,
        amount: Number(amount),
      });

      onCreated?.(newInvestment);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to create investment");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Investment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Invest in a vendor and grow your portfolio
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Vendor Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Vendor
            </label>
            <select
              value={businessId}
              onChange={(e) => setBusinessId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="">Choose vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Amount (₹)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
