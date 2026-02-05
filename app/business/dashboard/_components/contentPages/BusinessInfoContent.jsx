"use client";

import { useEffect, useState } from "react";
import BusinessInfoForm from "../BusinessInfoForm";

export default function BusinessInfoContent() {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const res = await fetch("/api/business-info");
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch");
        }

        setBusinessInfo(data.businessInfo);
      } catch (err) {
        setError("Failed to load business information");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessInfo();
  }, []);

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-7 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  /* -------------------- ERROR -------------------- */
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h2 className="font-semibold text-lg">Error</h2>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="p-6 space-y-8">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Business Information
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage your registered business details
        </p>
      </div>

      {/* ================= OVERVIEW ================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Business Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Business Name" value={businessInfo.name} />
          <Info label="Category ID" value={businessInfo.category_id} />

          <div className="md:col-span-2">
            <Info
              label="Description"
              value={businessInfo.description}
              multiline
            />
          </div>
        </div>
      </div>

      {/* ================= CONTACT ================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Email" value={businessInfo.email} />
          <Info label="Phone" value={businessInfo.phone} />
          <Info
            label="Website"
            value={businessInfo.website}
            isLink
          />
        </div>
      </div>

      {/* ================= LOCATION ================= */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Business Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <Info label="Address" value={businessInfo.address} />
          <Info label="Area" value={businessInfo.area} />
          <Info label="City" value={businessInfo.city} />
          <Info label="State" value={businessInfo.state} />
          <Info label="Postal Code" value={businessInfo.postal_code} />
          <Info label="Country" value={businessInfo.country} />
        </div>
      </div>

      {/* ================= EDIT FORM ================= */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">
            Edit Business Details
          </h2>
        </div>

        <div className="p-6">
          <BusinessInfoForm businessInfo={businessInfo} />
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL INFO COMPONENT ================= */

function Info({ label, value, multiline = false, isLink = false }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>

      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          className="font-medium text-blue-600 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p
          className={`font-medium text-gray-800 ${
            multiline ? "whitespace-pre-line" : ""
          }`}
        >
          {value || "—"}
        </p>
      )}
    </div>
  );
}
