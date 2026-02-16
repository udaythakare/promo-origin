import { getInvestorProfile } from "@/app/actions/investors/getInvestorProfile";
import { User, ShieldCheck } from "lucide-react";

export default async function InvestorProfilePage() {
  const profile = await getInvestorProfile();

  if (!profile) {
    return (
      <div className="text-center py-16 text-gray-500">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ================= HEADER SECTION ================= */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-5">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
              <User size={36} />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile.full_name}
              </h1>
              <p className="text-sm opacity-90">
                {profile.users?.email}
              </p>
              <p className="text-xs opacity-80 mt-1">
                {profile.profile_type?.toUpperCase()} Investor
              </p>
            </div>
          </div>

          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                profile.is_verified
                  ? "bg-white text-green-600"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <ShieldCheck size={16} />
              {profile.is_verified ? "Verified Investor" : "Verification Pending"}
            </span>
          </div>

        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* ================= BASIC INFO CARD ================= */}
        <div className="bg-white rounded-2xl shadow-md border p-6 space-y-6">
          <SectionTitle title="Basic Information" />

          <div className="grid sm:grid-cols-2 gap-6">
            <Info label="Full Name" value={profile.full_name} />
            <Info label="Email" value={profile.users?.email} />
            <Info label="Phone" value={profile.phone} />
            <Info label="City" value={profile.city} />
            <Info label="Profile Type" value={profile.profile_type} />
          </div>

          {profile.profile_type === "company" && (
            <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t">
              <Info label="Company Name" value={profile.company_name} />
              <Info label="Registration Number" value={profile.registration_number} />
            </div>
          )}
        </div>

        {/* ================= INVESTMENT CARD ================= */}
        <div className="bg-white rounded-2xl shadow-md border p-6 space-y-6">
          <SectionTitle title="Investment Preferences" />

          <div className="grid sm:grid-cols-2 gap-6">
            <Info label="Risk Appetite" value={profile.risk_appetite} />
            <Info label="Investment Type" value={profile.investment_type} />
            <Info
              label="Investment Range"
              value={`₹${profile.investment_range_min?.toLocaleString()} - ₹${profile.investment_range_max?.toLocaleString()}`}
            />
            <Info label="Expected ROI" value={`${profile.expected_roi}%`} />
            <Info label="Investment Horizon" value={profile.investment_horizon} />
            <Info label="Annual Income" value={`₹${profile.annual_income?.toLocaleString()}`} />
          </div>
        </div>

      </div>

      {/* ================= KYC SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6 space-y-4">
        <SectionTitle title="KYC & Verification Details" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">KYC Status</p>
            <p className="font-medium text-gray-900 capitalize">
              {profile.kyc_status}
            </p>
          </div>

          <div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                profile.is_verified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {profile.is_verified ? "Approved" : "Pending Review"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ================= Reusable Components ================= */

function SectionTitle({ title }) {
  return (
    <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
      {title}
    </h2>
  );
}

function Info({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">
        {value || "-"}
      </p>
    </div>
  );
}
