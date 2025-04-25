// app/businesses/[id]/edit/page.jsx - Edit business page (Server Component)
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import BusinessForm from '../../components/BusinessForm';

// Initialize Supabase client (server-side)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function EditBusinessPage({ params }) {
    const { id } = params;

    // Fetch business data
    const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

    if (businessError || !business) {
        notFound();
    }

    // Fetch business locations
    const { data: locations, error: locationsError } = await supabase
        .from('business_locations')
        .select('*')
        .eq('business_id', id)
        .order('is_primary', { ascending: false });

    if (locationsError) {
        console.error('Error fetching locations:', locationsError);
        // Handle error appropriately
    }

    // Fetch categories for the form
    const { data: categories, error: categoriesError } = await supabase
        .from('business_categories')
        .select('id, name')
        .order('name', { ascending: true });

    if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        // Handle error appropriately
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href={`/businesses/${id}`} className="text-blue-600 hover:text-blue-800">
                    ← Back to Business Details
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-700 p-6 text-white">
                    <h1 className="text-2xl font-bold">Edit Business</h1>
                    <p className="text-blue-100 mt-1">{business.name}</p>
                </div>
                <div className="p-6">
                    <BusinessForm
                        business={business}
                        locations={locations || []}
                        categories={categories || []}
                        isEditing={true}
                    />
                </div>
            </div>
        </div>
    );
}