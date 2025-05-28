'use client';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function useRealtimeCoupon(initialCoupon) {
    const [coupon, setCoupon] = useState(initialCoupon);
    // const supabase = createClientComponentClient();

    useEffect(() => {
        const channel = supabase
            .channel(`coupon-${coupon.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'coupons',
                    filter: `id=eq.${coupon.id}`,
                },
                (payload) => {
                    console.log('Coupon updated:', payload);
                    setCoupon(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [coupon.id, supabase]);

    return coupon;
}