"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveInvestorProfile } from "./actions/saveInvestorProfile";

export default function ApplyForInvestorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    country: "",
    profileType: "individual",
    companyName: "",
    registrationNumber: "",
    officeAddress: "",
    netWorth: "",
    annualIncome: "",
    investmentRangeMin: "",
    investmentRangeMax: "",
    riskAppetite: "",
    investmentType: "",
    debtInterestRate: "",
    investmentHorizon: "",
    expectedROI: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      form.investmentRangeMin &&
      form.investmentRangeMax &&
      Number(form.investmentRangeMin) > Number(form.investmentRangeMax)
    ) {
      alert("Minimum investment cannot be greater than maximum.");
      setLoading(false);
      return;
    }

    try {
      await saveInvestorProfile(form);
      router.push("/investors");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white border-4 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-500 border-b-4 border-black p-6 text-white">
          <h1 className="text-3xl font-black">
            Investor Onboarding
          </h1>
          <p className="text-sm font-semibold mt-1">
            Complete your profile to start investing in local businesses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* SECTION 1: PERSONAL INFORMATION */}
          <div>
            <h2 className="text-xl font-black mb-4 border-b-2 border-black pb-2">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
                required
              />

              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />

              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />
            </div>
          </div>

          {/* SECTION 2: PROFILE TYPE */}
          <div>
            <h2 className="text-xl font-black mb-4 border-b-2 border-black pb-2">
              Profile Type
            </h2>

            <select
              name="profileType"
              value={form.profileType}
              onChange={handleChange}
              className="w-full border-2 border-black p-3 rounded-md"
            >
              <option value="individual">Individual Investor</option>
              <option value="company">Company / Fund</option>
            </select>

            {form.profileType === "company" && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <input
                  name="companyName"
                  placeholder="Company Name"
                  value={form.companyName}
                  onChange={handleChange}
                  className="border-2 border-black p-3 rounded-md"
                />

                <input
                  name="registrationNumber"
                  placeholder="Registration Number"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  className="border-2 border-black p-3 rounded-md"
                />

                <textarea
                  name="officeAddress"
                  placeholder="Office Address"
                  value={form.officeAddress}
                  onChange={handleChange}
                  className="border-2 border-black p-3 rounded-md md:col-span-2"
                />
              </div>
            )}
          </div>

          {/* SECTION 3: FINANCIAL CAPACITY */}
          <div>
            <h2 className="text-xl font-black mb-4 border-b-2 border-black pb-2">
              Financial Capacity
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="netWorth"
                type="number"
                placeholder="Net Worth (₹)"
                value={form.netWorth}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />

              <input
                name="annualIncome"
                type="number"
                placeholder="Annual Income (₹)"
                value={form.annualIncome}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />

              <input
                name="investmentRangeMin"
                type="number"
                placeholder="Min Investment (₹)"
                value={form.investmentRangeMin}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />

              <input
                name="investmentRangeMax"
                type="number"
                placeholder="Max Investment (₹)"
                value={form.investmentRangeMax}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />
            </div>
          </div>

          {/* SECTION 4: INVESTMENT STRATEGY */}
          <div>
            <h2 className="text-xl font-black mb-4 border-b-2 border-black pb-2">
              Investment Strategy
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="riskAppetite"
                value={form.riskAppetite}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              >
                <option value="">Risk Appetite</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                name="investmentType"
                value={form.investmentType}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              >
                <option value="">Investment Type</option>
                <option value="equity">Equity</option>
                <option value="debt">Debt</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {form.investmentType === "debt" && (
                <input
                  name="debtInterestRate"
                  type="number"
                  placeholder="Debt Interest Rate (%)"
                  value={form.debtInterestRate}
                  onChange={handleChange}
                  className="border-2 border-black p-3 rounded-md"
                />
              )}

              <input
                name="investmentHorizon"
                placeholder="Investment Horizon (e.g. 12 months)"
                value={form.investmentHorizon}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />

              <input
                name="expectedROI"
                type="number"
                placeholder="Expected ROI (%)"
                value={form.expectedROI}
                onChange={handleChange}
                className="border-2 border-black p-3 rounded-md"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-lg"
          >
            {loading ? "Processing..." : "Complete Registration"}
          </button>

        </form>
      </div>
    </div>
  );
}
