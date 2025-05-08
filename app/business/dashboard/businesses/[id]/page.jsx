// app/businesses/[id]/page.jsx - View business details (Server Component)
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import DeleteBusinessButton from '../components/DeleteBusinessButton';

// Initialize Supabase client (server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function BusinessDetailsPage({ params }) {
    const { id } = params;

    // Fetch business details with category name
    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select(`
      id, 
      name, 
      description, 
      website, 
      phone, 
      email, 
      created_at,
      business_categories (
        name
      )
    `)
        .eq('id', id)
        .single();

    if (businessError || !business) {
        notFound();
    }

    // Fetch all locations for this business
    const { data: locations, error: locationsError } = await supabase
        .from('business_locations')
        .select('id, address, city, state, postal_code, country, latitude, longitude, is_primary')
        .eq('business_id', id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

    if (locationsError) {
        console.error('Error fetching locations:', locationsError);
        // Handle locations error appropriately
    }

    // Format the business data to match expected structure
    const formattedBusiness = {
        ...business,
        category_name: business.business_categories?.name || null
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/business/dashboard/businesses" className="text-blue-600 hover:text-blue-800">
                    ← Back to Businesses
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-700 p-6 text-white">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    {business.category_name && (
                        <span className="inline-block bg-blue-800 text-sm rounded-full px-3 py-1 mt-2">
                            {business.category_name}
                        </span>
                    )}
                </div>

                <div className="p-6">
                    {business.description && (
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">Description</h2>
                            <p className="text-gray-700">{business.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-blue-800 mb-2">Contact Information</h2>
                            <ul className="space-y-2">
                                {business.website && (
                                    <li className="flex items-start">
                                        <span className="font-medium w-20">Website:</span>
                                        <a href={business.website} target="_blank" rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 break-all">
                                            {business.website}
                                        </a>
                                    </li>
                                )}
                                {business.email && (
                                    <li className="flex items-start">
                                        <span className="font-medium w-20">Email:</span>
                                        <a href={`mailto:${business.email}`} className="text-blue-600 hover:text-blue-800 break-all">
                                            {business.email}
                                        </a>
                                    </li>
                                )}
                                {business.phone && (
                                    <li className="flex items-start">
                                        <span className="font-medium w-20">Phone:</span>
                                        <a href={`tel:${business.phone}`} className="text-blue-600 hover:text-blue-800">
                                            {business.phone}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {locations.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-blue-800 mb-2">Locations</h2>
                                <div className="space-y-4">
                                    {locations.map((location) => (
                                        <div key={location.id} className={`p-3 rounded-md ${location.is_primary ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                                            {location.is_primary && (
                                                <span className="text-xs font-medium text-blue-600 mb-1 block">Primary Location</span>
                                            )}
                                            <address className="not-italic">
                                                <div>{location.address}</div>
                                                <div>{location.city}, {location.state} {location.postal_code}</div>
                                                <div>{location.country}</div>
                                            </address>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <Link
                            href={`/business/dashboard/businesses/${id}/edit`}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
                        >
                            Edit Business
                        </Link>
                        <DeleteBusinessButton
                            businessId={id}
                            businessName={business.name}
                            redirectAfterDelete="/businesses"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}