// app/businesses/components/BusinessForm.tsx - Business form (Client Component)
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { geocodeAddress } from '@/helpers/geocoding';

export default function BusinessForm({ business, locations = [], categories, isEditing = false }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [geocodingErrors, setGeocodingErrors] = useState({});

    // Initialize form state from props or with default values
    const [formData, setFormData] = useState({
        name: business?.name || '',
        description: business?.description || '',
        category_id: business?.category_id || '',
        website: business?.website || '',
        phone: business?.phone || '',
        email: business?.email || '',
    });

    // Initialize locations state with geocoding fields
    const [businessLocations, setBusinessLocations] = useState(
        locations.length > 0
            ? locations.map(loc => ({
                id: loc.id,
                address: loc.address,
                city: loc.city,
                state: loc.state,
                postal_code: loc.postal_code,
                country: loc.country,
                latitude: loc.latitude || null,
                longitude: loc.longitude || null,
                is_primary: loc.is_primary,
            }))
            : [
                {
                    address: '',
                    city: '',
                    state: '',
                    postal_code: '',
                    country: 'USA',
                    latitude: null,
                    longitude: null,
                    is_primary: true,
                },
            ]
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (index, field, value) => {
        const updatedLocations = [...businessLocations];
        updatedLocations[index] = { ...updatedLocations[index], [field]: value };

        // Clear latitude/longitude when address components change
        if (['address', 'city', 'state', 'postal_code', 'country'].includes(field)) {
            updatedLocations[index].latitude = null;
            updatedLocations[index].longitude = null;
        }

        setBusinessLocations(updatedLocations);

        // Clear any existing geocoding errors for this location
        if (geocodingErrors[index]) {
            const updatedErrors = { ...geocodingErrors };
            delete updatedErrors[index];
            setGeocodingErrors(updatedErrors);
        }
    };

    const addLocation = () => {
        setBusinessLocations([
            ...businessLocations,
            {
                address: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'USA',
                latitude: null,
                longitude: null,
                is_primary: false,
            },
        ]);
    };

    const removeLocation = (index) => {
        if (businessLocations.length === 1) {
            toast.error('At least one location is required');
            return;
        }

        const updatedLocations = [...businessLocations];
        updatedLocations.splice(index, 1);

        // If we removed the primary location, set the first one as primary
        if (businessLocations[index].is_primary && updatedLocations.length > 0) {
            updatedLocations[0].is_primary = true;
        }

        setBusinessLocations(updatedLocations);

        // Clear any geocoding errors for this location
        if (geocodingErrors[index]) {
            const updatedErrors = { ...geocodingErrors };
            delete updatedErrors[index];
            setGeocodingErrors(updatedErrors);
        }
    };

    const setPrimaryLocation = (index) => {
        const updatedLocations = businessLocations.map((loc, i) => ({
            ...loc,
            is_primary: i === index,
        }));
        setBusinessLocations(updatedLocations);
    };

    // Function to geocode a specific location
    const geocodeLocation = async (index) => {
        // // // console.log('entered in geocode location')
        const location = businessLocations[index];

        if (!location.address || !location.city || !location.state || !location.postal_code) {
            setGeocodingErrors(prev => ({
                ...prev,
                [index]: "Complete address information is required for geocoding"
            }));
            return false;
        }

        try {
            const coordinates = await geocodeAddress(
                location.address,
                location.city,
                location.state,
                location.postal_code,
                location.country
            );

            // // console.log(coordinates, 'this is coordinates')

            if (coordinates) {
                const updatedLocations = [...businessLocations];
                updatedLocations[index] = {
                    ...updatedLocations[index],
                    latitude: coordinates.latitude,
                    longitude: coordinates.longitude
                };
                setBusinessLocations(updatedLocations);

                // // console.log(businessLocations, 'this is business location')

                // Clear any geocoding errors
                if (geocodingErrors[index]) {
                    const updatedErrors = { ...geocodingErrors };
                    delete updatedErrors[index];
                    setGeocodingErrors(updatedErrors);
                }

                return true;
            } else {
                setGeocodingErrors(prev => ({
                    ...prev,
                    [index]: "Could not find coordinates for this address"
                }));
                return false;
            }
        } catch (error) {
            setGeocodingErrors(prev => ({
                ...prev,
                [index]: "Error geocoding address"
            }));
            console.error('Geocoding error:', error);
            return false;
        }
    };

    // Geocode all locations
    const geocodeAllLocations = async () => {
        let success = true;
        const validLocationIndices = businessLocations
            .map((loc, index) => ({ loc, index }))
            .filter(({ loc }) =>
                loc.address.trim() && loc.city.trim() &&
                loc.state.trim() && loc.postal_code.trim()
            )
            .map(({ index }) => index);

        for (const index of validLocationIndices) {
            // Skip if we already have coordinates
            if (businessLocations[index].latitude && businessLocations[index].longitude) {
                continue;
            }

            const result = await geocodeLocation(index);
            if (!result) success = false;
        }

        return success;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);


        try {
            // Validate required fields
            if (!formData.name.trim()) {
                toast.error('Business name is required');
                setIsSubmitting(false);
                return;
            }

            // Validate at least one location with required fields
            const validLocations = businessLocations.filter(
                loc => loc.address.trim() && loc.city.trim() && loc.state.trim() && loc.postal_code.trim()
            );

            if (validLocations.length === 0) {
                toast.error('At least one complete location is required');
                setIsSubmitting(false);
                return;
            }

            // Ensure one location is marked as primary
            if (!businessLocations.some(loc => loc.is_primary)) {
                businessLocations[0].is_primary = true;
            }


            // // console.log('entered here')

            // Geocode the locations if needed
            toast.loading('Geocoding addresses...', { id: 'geocoding' });
            const geocodingSuccess = await geocodeAllLocations();
            toast.dismiss('geocoding');

            if (!geocodingSuccess) {
                toast.error('There were issues geocoding some addresses');
                setIsSubmitting(false);
                return;
            }

            // Prepare API endpoint and method
            const url = isEditing
                ? `/api/businesses/${business.id}`
                : '/api/businesses';

            const method = isEditing ? 'PUT' : 'POST';

            toast.loading('Saving business information...', { id: 'saving' });

            // Make API request
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    locations: businessLocations,
                }),
            });

            toast.dismiss('saving');

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Something went wrong');
            }

            const result = await response.json();

            toast.success(isEditing ? 'Business updated successfully' : 'Business created successfully');
            router.push(`/business/dashboard/businesses/${result.id}`);
            router.refresh(); // Refresh server components
        } catch (error) {
            toast.error(error.message || 'An error occurred');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-blue-800">Business Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            My Business Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                            Website
                        </label>
                        <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-blue-800">Locations</h2>
                    <button
                        type="button"
                        onClick={addLocation}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + Add Another Location
                    </button>
                </div>

                {businessLocations.map((location, index) => (
                    <div key={index} className={`p-4 rounded-md border ${location.is_primary ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id={`primary-${index}`}
                                    name="primary-location"
                                    checked={location.is_primary}
                                    onChange={() => setPrimaryLocation(index)}
                                    className="mr-2"
                                />
                                <label htmlFor={`primary-${index}`} className="text-sm font-medium">
                                    Primary Location
                                </label>
                            </div>

                            {businessLocations.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLocation(index)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-full">
                                <label htmlFor={`address-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    id={`address-${index}`}
                                    value={location.address}
                                    onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={`city-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    id={`city-${index}`}
                                    value={location.city}
                                    onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={`state-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    State/Province *
                                </label>
                                <input
                                    type="text"
                                    id={`state-${index}`}
                                    value={location.state}
                                    onChange={(e) => handleLocationChange(index, 'state', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={`postal_code-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    id={`postal_code-${index}`}
                                    value={location.postal_code}
                                    onChange={(e) => handleLocationChange(index, 'postal_code', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor={`country-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    id={`country-${index}`}
                                    value={location.country}
                                    onChange={(e) => handleLocationChange(index, 'country', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-200 disabled:opacity-70"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Business' : 'Create Business'}
                </button>
            </div>
        </form>
    );
}