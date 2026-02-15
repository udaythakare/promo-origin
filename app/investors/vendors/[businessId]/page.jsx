import { getVendorDetails } from "../../../actions/investors/getVendorDetails.js";
import { getVendorConnection } from "../../../actions/investors/getVendorConnection.js";
import { getUserId } from "../../../../helpers/userHelper.js";
import VendorRequestButton from "../../../actions/investors/VendorRequestButton";
import { redirect } from "next/navigation";

export default async function VendorDetailPage({ params }) {

  // ✅ NEXT 15 FIX (params must be awaited)
  const { businessId } = await params;

  const userId = await getUserId();

  if (!userId || userId?.msg) {
    redirect("/login");
  }

  const vendor = await getVendorDetails(businessId);

  if (!vendor) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center text-gray-500">
        Vendor not found.
      </div>
    );
  }

  const connection = await getVendorConnection({
    investorId: userId,
    vendorUserId: vendor.user_id,
  });

  const status = connection?.status || "none";

  const primaryLocation =
    vendor.business_locations?.find((l) => l.is_primary) ||
    vendor.business_locations?.[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ================= HEADER CARD ================= */}
      <div className="bg-white border rounded-2xl p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {vendor.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3">

              {vendor.business_categories?.name && (
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {vendor.business_categories.name}
                </span>
              )}

              {primaryLocation && (
                <span className="text-sm text-gray-500">
                  📍 {primaryLocation.city}, {primaryLocation.state}
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="w-full lg:w-auto">
            <VendorRequestButton
              investorId={userId}
              vendorUserId={vendor.user_id}
              initialStatus={status}
            />
          </div>
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div className="bg-white border rounded-2xl p-6 lg:p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          About the Business
        </h2>

        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
          {vendor.description || "No description provided."}
        </p>
      </div>

      {/* ================= CONTACT SECTION ================= */}
      <div className="bg-white border rounded-2xl p-6 lg:p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">

          <div>
            <p className="font-medium text-gray-900">Phone</p>
            <p>{vendor.phone || "Not available"}</p>
          </div>

          <div>
            <p className="font-medium text-gray-900">Email</p>
            <p>{vendor.email || "Not available"}</p>
          </div>

          <div className="sm:col-span-2">
            <p className="font-medium text-gray-900">Website</p>
            {vendor.website ? (
              <a
                href={vendor.website}
                target="_blank"
                className="text-blue-600 hover:underline break-all"
              >
                {vendor.website}
              </a>
            ) : (
              <p>Not available</p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
