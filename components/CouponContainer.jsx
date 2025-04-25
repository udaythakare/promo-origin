// components/CouponContainer.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FilterBar from '@/components/FilterBar';
import CouponCard from '@/components/CouponCard';
import { supabase } from '@/lib/supabase';

export default function CouponContainer({
    initialCoupons,
    initialCategories,
    initialAreas,
    initialFilters,
    isLoggedIn,
    userId
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [coupons, setCoupons] = useState(initialCoupons);
    const [filters, setFilters] = useState(initialFilters);
    const [loading, setLoading] = useState(false);

    // Apply filters when they change
    useEffect(() => {
        async function fetchFilteredCoupons() {
            setLoading(true);
            try {
                let query = supabase
                    .from('coupons')
                    .select(`
            *,
            vendors:vendor_id (business_name, logo_url),
            coupon_locations (
              shop_location_id,
              shop_locations:shop_location_id (area, location_name, address)
            )
          `)
                    .eq('is_active', true)
                    .gte('valid_until', new Date().toISOString());

                // Apply search term filter
                if (filters.searchTerm) {
                    query = query.or(`description.ilike.%${filters.searchTerm}%,vendors.business_name.ilike.%${filters.searchTerm}%`);
                }

                const { data, error } = await query;

                if (error) throw error;

                // Filter by category (client-side for now as it's a many-to-many relation)
                let filteredData = data;

                // Apply area filter (client-side since we need to check within coupon_locations)
                if (filters.area) {
                    filteredData = filteredData.filter(coupon =>
                        coupon.coupon_locations.some(cl =>
                            cl.shop_locations.area.toLowerCase() === filters.area.toLowerCase()
                        )
                    );
                }

                setCoupons(filteredData);

                // Update URL with filters for shareable links
                const params = new URLSearchParams();
                if (filters.category) params.set('category', filters.category);
                if (filters.area) params.set('area', filters.area);
                if (filters.searchTerm) params.set('search', filters.searchTerm);

                const queryString = params.toString();
                const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

                console.log('**************************')

                // Use router.replace to update the URL without a full page reload
                // router.replace(newUrl);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            } finally {
                setLoading(false);
            }
        }

        // Only run filter effect if there are any filter values
        if (Object.values(filters).some(val => val !== '')) {
            fetchFilteredCoupons();
        }
    }, [filters, pathname, router]);

    const handleFilterChange = (newFilters) => {
        setFilters({ ...filters, ...newFilters });
    };

    const handleClaimCoupon = async (couponId) => {
        if (!isLoggedIn) {
            alert('Please log in to claim this coupon');
            return;
        }

        try {
            // Generate unique claim code
            const uniqueClaimCode = `CLAIM-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

            const { data, error } = await supabase
                .from('coupon_claims')
                .insert({
                    user_id: userId,
                    coupon_id: couponId,
                    unique_claim_code: uniqueClaimCode,
                    status: 'claimed'
                })
                .select();

            if (error) throw error;

            // Update the coupon's current_claims count
            await supabase
                .from('coupons')
                .update({ current_claims: supabase.rpc('increment', { row_id: couponId }) })
                .eq('id', couponId);

            alert(`Coupon claimed successfully! Your claim code is: ${uniqueClaimCode}`);

            // Refresh coupons to update the UI
            const { data: updatedCoupons } = await supabase
                .from('coupons')
                .select(`
          *,
          vendors:vendor_id (business_name, logo_url),
          coupon_locations (
            shop_location_id,
            shop_locations:shop_location_id (area, location_name, address)
          )
        `)
                .eq('is_active', true)
                .gte('valid_until', new Date().toISOString());

            setCoupons(updatedCoupons);
        } catch (error) {
            console.error('Error claiming coupon:', error);
            alert('Failed to claim coupon. Please try again.');
        }
    };

    return (
        <>
            <FilterBar
                categories={initialCategories}
                areas={initialAreas}
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {loading ? (
                <div className="flex justify-center my-12">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {coupons.length > 0 ? (
                        coupons.map(coupon => (
                            <CouponCard
                                key={coupon.id}
                                coupon={coupon}
                                isLoggedIn={isLoggedIn}
                                onClaim={() => handleClaimCoupon(coupon.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            <p className="text-xl">No coupons found matching your criteria</p>
                            <button
                                onClick={() => setFilters({ category: '', area: '', searchTerm: '' })}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}