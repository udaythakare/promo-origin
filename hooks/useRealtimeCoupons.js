'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export function useRealtimeCoupons(initialCoupons, userId) {
    const [coupons, setCoupons] = useState(initialCoupons);

    useEffect(() => {
        // Set up realtime subscription
        const channel = supabase
            .channel('coupons-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'coupons',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Realtime update:', payload);
                    switch (payload.eventType) {
                        case 'INSERT':
                            setCoupons(prev => [payload.new, ...prev]);
                            break;
                        case 'UPDATE':
                            // Check if this is ONLY a claims count update
                            const isOnlyClaimsUpdate =
                                payload.old.current_claims !== payload.new.current_claims &&
                                // Check if other important fields haven't changed
                                payload.old.title === payload.new.title &&
                                payload.old.description === payload.new.description &&
                                payload.old.is_active === payload.new.is_active &&
                                payload.old.start_date === payload.new.start_date &&
                                payload.old.end_date === payload.new.end_date;

                            // Skip if it's only a claims update - let useRealtimeClaimsCount handle it
                            if (isOnlyClaimsUpdate) {
                                console.log('Skipping claims-only update in useRealtimeCoupons');
                                break;
                            }

                            // Update other fields but preserve current claims count
                            setCoupons(prev =>
                                prev.map(coupon => {
                                    if (coupon.id === payload.new.id) {
                                        return {
                                            ...payload.new,
                                            current_claims: coupon.current_claims // Preserve existing claims count
                                        };
                                    }
                                    return coupon;
                                })
                            );
                            break;
                        case 'DELETE':
                            setCoupons(prev =>
                                prev.filter(coupon => coupon.id !== payload.old.id)
                            );
                            break;
                    }
                }
            )
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return coupons;
}