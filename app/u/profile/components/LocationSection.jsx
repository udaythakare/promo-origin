import { cookies } from 'next/headers'
import LocationForm from './LocationForm'
import { updateUserLocation } from '../apply-for-investor/actions/userActions'

// Fetch location data with caching
export async function fetchLocationData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const apiUrl = `${baseUrl}/api/profile/location-data`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: (await cookies()).toString()
            },
            cache: 'force-cache', // Enable caching
            next: {
                revalidate: 3600 // Revalidate every hour
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching location data:', error);
        return null;
    }
}

// Fetch dropdown data (can be cached differently)
export async function fetchDropdownData() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

    try {
        const response = await fetch(`${baseUrl}/api/profile/address-dropdown-data`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                Cookie: (await cookies()).toString()
            },
            // Less frequent revalidation as dropdown data might change less often
            cache: 'force-cache',
            next: {
                revalidate: 86400 // Revalidate daily
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dropdown data');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
        return null;
    }
}

export default async function LocationSection() {
    // Fetch both location and dropdown data concurrently
    const [locationDataResponse, dropdownDataResponse] = await Promise.all([
        fetchLocationData(),
        fetchDropdownData()
    ]);

    // Handle errors if either fetch fails
    if (!locationDataResponse || !dropdownDataResponse) {
        return (
            <div className="p-4 border-2 border-red-500 bg-red-50">
                <p className="text-red-700">Failed to load location data. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            <LocationForm
                initialData={locationDataResponse.data}
                onSubmit={updateUserLocation}
                dropDownData={dropdownDataResponse}
            />
        </div>
    );
}