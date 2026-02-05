"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveInvestorProfile } from "./actions/saveInvestorProfile";

export default function ApplyForInvestorPage() {
  const router = useRouter();

  // 🔑 hydration guard
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    investmentRange: "",
    investmentInterest: "",
  });

  // 🔑 render ONLY after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // nothing rendered on server → no hydration mismatch possible
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveInvestorProfile(form);
      router.push("/investors");
    } catch (error) {
      console.error("Save investor failed:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-lg">
        <h1 className="text-2xl font-black mb-4">
          Investor Information
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="off"
        >
          <input
            name="fullName"
            value={form.fullName}
            placeholder="Full Name"
            onChange={handleChange}
            autoComplete="off"
            className="w-full border-2 border-black p-2"
          />

          <input
            name="phone"
            value={form.phone}
            placeholder="Phone Number"
            onChange={handleChange}
            autoComplete="off"
            className="w-full border-2 border-black p-2"
          />

          <input
            name="city"
            value={form.city}
            placeholder="City"
            onChange={handleChange}
            autoComplete="off"
            className="w-full border-2 border-black p-2"
          />

          <select
            name="investmentRange"
            value={form.investmentRange}
            onChange={handleChange}
            className="w-full border-2 border-black p-2"
          >
            <option value="">Investment Range</option>
            <option value="₹50k – ₹1L">₹50k – ₹1L</option>
            <option value="₹1L – ₹5L">₹1L – ₹5L</option>
            <option value="₹5L+">₹5L+</option>
          </select>

          <textarea
            name="investmentInterest"
            value={form.investmentInterest}
            placeholder="What kind of businesses do you want to invest in?"
            onChange={handleChange}
            className="w-full border-2 border-black p-2"
            rows={4}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-300 border-2 border-black py-3 font-bold"
          >
            {loading ? "Submitting..." : "Submit & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
