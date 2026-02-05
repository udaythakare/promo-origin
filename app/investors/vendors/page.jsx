import Link from "next/link";
import { getVendors } from "@/app/actions/investors/getVendors";

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Available Businesses
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore verified businesses open for investment
        </p>
      </div>

      {vendors.length === 0 ? (
        <p className="text-gray-500">No vendors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => {
            const primaryLocation =
              vendor.business_locations?.find((loc) => loc.is_primary) ||
              vendor.business_locations?.[0];

            return (
              <div
                key={vendor.id}
                className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* Business Info */}
                <div>
                  {/* Name + Category */}
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">
                      {vendor.name}
                    </h2>

                    {vendor.business_categories?.name && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
                        {vendor.business_categories.name}
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  {primaryLocation && (
                    <p className="text-sm text-gray-500 mt-2">
                      📍 {primaryLocation.city}, {primaryLocation.state}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-700 mt-4 leading-relaxed line-clamp-3">
                    {vendor.description || "No description available."}
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-5" />

                {/* Action */}
                <Link
                  href={`/investors/vendors/${vendor.id}`}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium rounded-lg bg-black text-white hover:bg-gray-800 transition"
                >
                  View Business
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
