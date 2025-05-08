// app/businesses/new/page.tsx - Add new business page (Server Component)
import React from 'react';
import Link from 'next/link';
// import BusinessForm from './components/BusinessForm';
import { createClient } from '@supabase/supabase-js';
import BusinessForm from '../components/BusinessForm';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function AddBusinessPage() {


    // Fetch categories for the form using Supabase
    const { data: categories, error } = await supabase
        .from('business_categories')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) {
        console.error('Error fetching business categories:', error);
        // You might want to handle this more gracefully
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/business/dashboard/businesses" className="text-blue-600 hover:text-blue-800">
                    ← Back to Businesses
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-700 p-6 text-white">
                    <h1 className="text-2xl font-bold">Add New Business</h1>
                </div>
                <div className="p-6">
                    <BusinessForm categories={categories || []} />
                </div>
            </div>
        </div>
    );
}