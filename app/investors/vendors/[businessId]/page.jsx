import { getVendorDetails } from "../../../actions/investors/getVendorDetails.js";
import { getVendorConnection } from "../../../actions/investors/getVendorConnection.js";
import { getUserId } from "../../../../helpers/userHelper.js";
import VendorRequestButton from "../../../actions/investors/VendorRequestButton";

export default async function VendorDetailPage({ params }) {
  const { businessId } = params;

  const userId = await getUserId();
  if (!userId || userId?.msg) {
    throw new Error("Unauthorized");
  }

  const vendor = await getVendorDetails(businessId);

  const connection = await getVendorConnection({
    investorId: userId,
    vendorUserId: vendor.user_id,
  });

  const status = connection?.status || "none";

  const primaryLocation =
    vendor.business_locations?.find((l) => l.is_primary) ||
    vendor.business_locations?.[0];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* ===== HEADER CARD ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              {vendor.name}
            </h1>

            <div className="flex items-center gap-3 mt-2">
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
          <VendorRequestButton
            investorId={userId}
            vendorUserId={vendor.user_id}
            initialStatus={status}
          />
        </div>
      </div>

      {/* ===== ABOUT ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          About the Business
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {vendor.description || "No description provided."}
        </p>
      </div>

      {/* ===== CONTACT ===== */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <strong>Phone:</strong>{" "}
            {vendor.phone || "Not available"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {vendor.email || "Not available"}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            {vendor.website ? (
              <a
                href={vendor.website}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                {vendor.website}
              </a>
            ) : (
              "Not available"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
