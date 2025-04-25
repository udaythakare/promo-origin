'use client';

import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Filter, MapPin, Percent, Tag, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function CouponsPage() {
    const [session, setSession] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [radius, setRadius] = useState(5);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    // Fetch user session on mount
    useEffect(() => {
        async function loadSession() {
            try {
                const userSession = await getSession();
                setSession(userSession);
            } catch (err) {
                console.error('Error fetching session:', err);
            }
        }
        loadSession();
    }, []);

    // Get user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (err) => {
                    console.error('Error getting location:', err);
                    setError('Unable to access your location. Please enable location services.');
                    setInitialLoading(false);
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
            setInitialLoading(false);
            setLoading(false);
        }
    }, []);

    // Fetch business categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const { data, error } = await supabase
                    .from('business_categories')
                    .select('id, name');

                if (error) throw error;
                setCategories(data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        }

        fetchCategories();
    }, []);

    // Fetch coupons when filters change and location is available
    useEffect(() => {
        if (location) {
            fetchCoupons();
        }
    }, [location, selectedCategory, radius, page]);

    async function fetchCoupons() {
        if (!location) return;

        setLoading(true);
        try {
            // Call the updated stored function to find nearest coupons
            // Note: We're using filter_category_id instead of category_id now
            const { data, error } = await supabase.rpc('find_nearest_coupons2', {
                user_lat: location.latitude,
                user_long: location.longitude,
                radius_km: radius,
                filter_category_id: selectedCategory,
                limit_count: itemsPerPage * page,
            });

            if (error) throw error;

            // Save search history if user is logged in
            if (session?.user?.id) {
                try {
                    await supabase.from('coupon_search_history').insert({
                        user_id: session.user.id,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        search_radius_km: radius,
                        category_filter: selectedCategory,
                    });
                } catch (historyError) {
                    // Just log the error but don't fail the main operation
                    console.error('Error saving search history:', historyError);
                }
            }

            setCoupons(data || []);
            setHasMore(data && data.length === itemsPerPage * page);
            setLoading(false);
            setInitialLoading(false);
        } catch (err) {
            console.error('Error fetching coupons:', err);
            setError('Failed to load coupons. Please try again.');
            setLoading(false);
            setInitialLoading(false);
        }
    }

    function loadMore() {
        setPage((prev) => prev + 1);
    }

    function handleRadiusChange(e) {
        setRadius(Number(e.target.value));
        setPage(1);
    }

    function handleCategoryChange(e) {
        setSelectedCategory(e.target.value === '' ? null : e.target.value);
        setPage(1);
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-bold">Nearby Coupons</h1>
                    {location && (
                        <div className="flex items-center text-sm mt-1">
                            <MapPin size={14} className="mr-1" />
                            <span>Within {radius} km of your location</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Filters */}
            <div className="bg-white p-4 border-b border-gray-200 sticky top-16 z-10">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex items-center">
                            <Filter size={18} className="text-blue-500 mr-2" />
                            <span className="font-medium">Filters:</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                            <div className="flex-1">
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedCategory || ''}
                                    onChange={handleCategoryChange}
                                    disabled={initialLoading}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(({ id, name }) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1">
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    value={radius}
                                    onChange={handleRadiusChange}
                                    disabled={initialLoading}
                                >
                                    <option value={1}>Within 1 km</option>
                                    <option value={5}>Within 5 km</option>
                                    <option value={10}>Within 10 km</option>
                                    <option value={25}>Within 25 km</option>
                                    <option value={50}>Within 50 km</option>
                                    <option value={500}>Within 500 km</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="container mx-auto px-4 py-6">
                {error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4 text-center">
                        {error}
                    </div>
                ) : initialLoading ? (
                    <div className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                        <p className="mt-4 text-gray-600">Finding coupons near you...</p>
                    </div>
                ) : coupons.length === 0 ? (
                    <div className="bg-blue-50 text-blue-600 p-8 rounded-lg mt-4 text-center">
                        <Search className="h-12 w-12 mx-auto mb-4" />
                        <h3 className="text-xl font-medium">No coupons found</h3>
                        <p className="mt-2">Try expanding your search radius or changing your filters</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {coupons.map((coupon) => (
                                <div
                                    key={coupon.coupon_id}
                                    className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                                >
                                    <div className="bg-blue-500 text-white p-3">
                                        <h3 className="font-bold truncate">{coupon.business_name}</h3>
                                    </div>
                                    <div>
                                        <Image
                                            src={coupon.image_url}
                                            width={200}
                                            height={200}
                                            key={coupon.coupon_id}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-medium text-lg mb-2">{coupon.coupon_title}</h4>
                                        <div className="flex items-center mb-2">
                                            <Percent size={16} className="text-blue-500 mr-2" />
                                            <span className="font-bold">
                                                {coupon.discount_type === 'percentage'
                                                    ? `${coupon.discount_value}% off`
                                                    : coupon.discount_type === 'fixed_amount'
                                                        ? `$${coupon.discount_value} off`
                                                        : coupon.discount_type === 'buy_one_get_one'
                                                            ? 'Buy One Get One'
                                                            : 'Free Item'}
                                            </span>
                                        </div>
                                        <div className="flex items-start mb-3">
                                            <MapPin size={16} className="text-gray-500 mr-2 mt-1 flex-shrink-0" />
                                            <span className="text-gray-600 text-sm">{coupon.location_address}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-100">
                                            <span className="text-sm text-gray-500">
                                                {coupon.distance_km.toFixed(1)} km away
                                            </span>
                                            <Link
                                                href={`/coupons/${coupon.coupon_id}`}
                                                className="flex items-center text-blue-600 font-medium text-sm"
                                            >
                                                View details
                                                <ChevronRight size={16} className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {hasMore && (
                            <div className="flex justify-center mt-8">
                                <button
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    onClick={loadMore}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                            Loading...
                                        </span>
                                    ) : (
                                        'Load More'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Navigation Footer */}
            {/* <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-20">
                <div className="container mx-auto flex justify-around">
                    <Link href="/coupons" className="flex flex-col items-center p-1">
                        <span className="text-blue-600">
                            <Tag size={20} />
                        </span>
                        <span className="text-xs mt-1 font-medium text-blue-600">Coupons</span>
                    </Link>
                    <Link href="/businesses" className="flex flex-col items-center p-1">
                        <span className="text-gray-500">
                            <ShoppingBag size={20} />
                        </span>
                        <span className="text-xs mt-1 text-gray-500">Businesses</span>
                    </Link>
                    {session ? (
                        <Link href="/profile" className="flex flex-col items-center p-1">
                            <span className="text-gray-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                            <span className="text-xs mt-1 text-gray-500">Profile</span>
                        </Link>
                    ) : (
                        <Link href="/login" className="flex flex-col items-center p-1">
                            <span className="text-gray-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                            </span>
                            <span className="text-xs mt-1 text-gray-500">Login</span>
                        </Link>
                    )}
                </div>
            </footer> */}
        </div>
    );
}