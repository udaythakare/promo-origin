"use client";

import { useState } from "react";
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

  /* ================= SUBMIT HANDLER ================= */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    /* 🔐 Basic validation */
    if (!businessId || !amount) {
      setError("Please select a vendor and enter amount");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      /* 🔗 Call server action */
      const newInvestment = await createInvestment({
        businessId,
        amount: Number(amount),
      });

      /* ✅ Optimistic UI callback */
      onCreated?.(newInvestment);

      /* ✅ Close modal */
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to create investment");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold">
          Create Investment
        </h2>

        {/* Vendor Select */}
        <select
          value={businessId}
          onChange={(e) => setBusinessId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name} {vendor.city ? `- ${vendor.city}` : ""}
            </option>
          ))}
        </select>

        {/* Amount */}
        <input
          type="number"
          placeholder="Investment Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Investment"}
          </button>
        </div>
      </form>
    </div>
  );
}
