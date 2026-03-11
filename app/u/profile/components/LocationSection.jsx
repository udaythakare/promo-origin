import { cookies } from "next/headers";
import LocationForm from "./LocationForm";
import { updateUserLocation } from "../apply-for-investor/actions/userActions";

// Fetch location data with caching
export async function fetchLocationData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const apiUrl = `${baseUrl}/api/profile/location-data`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await cookies()).toString(),
      },
      cache: "force-cache",
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching location data:", error);
    return null;
  }
}

// Fetch dropdown data
export async function fetchDropdownData() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  try {
    const response = await fetch(
      `${baseUrl}/api/profile/address-dropdown-data`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Cookie: (await cookies()).toString(),
        },
        cache: "force-cache",
        next: {
          revalidate: 86400,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dropdown data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    return null;
  }
}

export default async function LocationSection() {
  const [locationDataResponse, dropdownDataResponse] = await Promise.all([
    fetchLocationData(),
    fetchDropdownData(),
  ]);

  // Error UI
  if (!locationDataResponse || !dropdownDataResponse) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="border-2 border-black bg-red-50 rounded-xl p-6 shadow-sm text-center">
          <p className="text-red-700 font-medium">
            Failed to load location data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10">

      {/* Section Header */}
      <div className="mb-6">
        <h2
          className="text-xl sm:text-2xl font-bold"
          style={{ color: "#3716A8" }}
        >
          Your Location
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Update your address to discover nearby coupons and local deals.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white border-2 border-black rounded-xl shadow-sm p-5 sm:p-6">

        <LocationForm
          initialData={locationDataResponse.data}
          onSubmit={updateUserLocation}
          dropDownData={dropdownDataResponse}
        />

      </div>

    </section>
  );
}