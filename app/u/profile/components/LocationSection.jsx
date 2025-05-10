import React from 'react'
import LocationForm from './LocationForm'
import { updateUserLocation } from '../actions/userActions'
import { getAddressDropdowns } from '@/actions/addressActions'
import { cookies } from 'next/headers'

export default async function LocationSection({ userData }) {
    // Get user's existing location data from API
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const apiUrl = `${baseUrl}/api/profile/location-data`;

    try {
        const response1 = await fetch(apiUrl, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookies().toString()
            },
        });

        if (!response1.ok) {
            throw new Error('Failed to fetch location data');
        }

        const locationData = await response1.json();
        // console.log(locationData, '*******************');

        // Get dropdown data
        const response2 = await fetch(`${baseUrl}/api/profile/address-dropdown-data`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                // Forward the cookies from the incoming request to your API
                Cookie: cookies().toString()
            },
            cache: 'no-store' // Ensure fresh data
        });
        const dropDownData = await response2.json();

        // console.log(dropDownData, '*******************');
        // console.log(locationData, '*******************');

        return (
            <div className="max-w-xl mx-auto">
                <LocationForm
                    initialData={locationData.data}
                    onSubmit={updateUserLocation}
                    dropDownData={dropDownData}
                />
            </div>
        )
    } catch (error) {
        console.error('Error fetching location data:', error);
        // Handle the error appropriately
        return (
            <div className="p-4 border-2 border-red-500 bg-red-50">
                <p className="text-red-700">Failed to load location data. Please try again later.</p>
            </div>
        );
    }
}