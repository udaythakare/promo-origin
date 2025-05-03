import React from 'react'
import LocationForm from './LocationForm'
import { updateUserLocation } from '../actions/userActions'
import { getAddressDropdowns, getUserLocationData } from '@/actions/addressActions'

export default async function LocationSection({ userData }) {
    // Get user's existing location data if available
    // const locationData = userData?.location || {}
    const locationData = await getUserLocationData();
    const dropDownData = await getAddressDropdowns();
    console.log(locationData)

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