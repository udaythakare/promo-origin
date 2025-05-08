// app/businesses/page.jsx - Main businesses listing page (Server Component)
import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import DeleteBusinessButton from './components/DeleteBusinessButton';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

// Initialize Supabase client (server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function BusinessesPage() {
    // Fetch businesses with their primary location using Supabase
    const session = await getServerSession(options);
    const userId = session?.user?.id;

    const { data: businesses, error } = await supabase
        .from('businesses')
        .select(`
      id, 
      name, 
      description, 
      website, 
      phone, 
      email,
      business_locations!inner (
        city, 
        state
      )
    `)
        .eq('business_locations.is_primary', true)
        .order('created_at', { ascending: false })
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching businesses:', error);
        // Handle error appropriately
    }

    // Format the response to match the expected structure
    const formattedBusinesses = (businesses || []).map(business => ({
        id: business.id,
        name: business.name,
        description: business.description,
        website: business.website,
        phone: business.phone,
        email: business.email,
        city: business.business_locations[0]?.city,
        state: business.business_locations[0]?.state
    }));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-800">Businesses</h1>
                <Link
                    href="/business/dashboard/businesses/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
                >
                    Add Business
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedBusinesses.length > 0 ? (
                    formattedBusinesses.map((business) => (
                        <div
                            key={business.id}
                            className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                        >
                            <div className="bg-blue-100 p-4">
                                <h2 className="text-xl font-semibold text-blue-800">{business.name}</h2>
                                {business.city && business.state && (
                                    <p className="text-sm text-blue-600">{business.city}, {business.state}</p>
                                )}
                            </div>
                            <div className="p-4">
                                {business.description && (
                                    <p className="text-gray-600 mb-3 line-clamp-2">{business.description}</p>
                                )}
                                <div className="flex justify-end gap-2 mt-4">
                                    <Link
                                        href={`/businesses/${business.id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/business/dashboard/businesses/${business.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <DeleteBusinessButton businessId={business.id} businessName={business.name} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No businesses found.</p>
                        <Link
                            href="/business/dashboard/businesses/new"
                            className="text-blue-600 hover:text-blue-700 mt-2 inline-block font-medium"
                        >
                            Add your first business
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}