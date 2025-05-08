import React from 'react'
import LocationForm from './LocationForm'
import { updateUserLocation } from '../actions/userActions'
import { getAddressDropdowns } from '@/actions/addressActions'
import { cookies } from 'next/headers'

export default async function LocationSection({ userData }) {
    // Get user's existing location data from API
    const response1 = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/location-data`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            // Forward the cookies from the incoming request to your API
            Cookie: cookies().toString()
        },
        cache: 'no-store' // Ensure fresh data
    });

    // Parse the JSON response
    const locationData = await response1.json();
    console.log(locationData, '*******************');

    // Get dropdown data
    const response2 = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/profile/address-dropdown-data`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            // Forward the cookies from the incoming request to your API
            Cookie: cookies().toString()
        },
        cache: 'no-store' // Ensure fresh data
    });
    const dropDownData = await response2.json();

    return (
        <div className="max-w-xl mx-auto">
            <LocationForm
                initialData={locationData.data}
                onSubmit={updateUserLocation}
                dropDownData={dropDownData}
            />
        </div>
    )
}