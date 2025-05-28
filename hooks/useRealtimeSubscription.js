import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/helpers/userHelper';
import { revalidateHomeCouponPage } from '@/actions/revalidateActions';

export const useRealtimeUpdates = (isQROpen, selectedCoupon, refreshCouponData, setShowConfirmation, closeQRModal) => {
    useEffect(() => {
        let channel;

        const setupRealtimeSubscription = async () => {
            try {
                const userId = await getUserId();

                if (!userId) {
                    console.log('No userId, skipping subscription setup');
                    return;
                }

                console.log('Setting up realtime subscription for user:', userId);

                channel = supabase
                    .channel(`user_coupons_changes_${userId}`)
                    .on(
                        'postgres_changes',
                        {
                            event: '*',
                            schema: 'public',
                            table: 'user_coupons',
                            filter: `user_id=eq.${userId}`
                        },
                        (payload) => {
                            console.log('Realtime payload received:', payload);
                            refreshCouponData();

                            const updatedCoupon = payload.new;

                            if (payload.eventType === 'UPDATE' && updatedCoupon?.coupon_status === 'redeemed') {
                                console.log('Coupon redeemed:', updatedCoupon);

                                if (isQROpen && selectedCoupon && selectedCoupon.id === updatedCoupon.coupon_id) {
                                    console.log('Coupon redeemed for currently open QR modal');
                                    setShowConfirmation(true);

                                    setTimeout(() => {
                                        closeQRModal();
                                    }, 1000);
                                }
                                revalidateHomeCouponPage();
                            }
                        }
                    )
                    .subscribe((status) => {
                        console.log('Subscription status:', status);
                    });

            } catch (error) {
                console.error('Error setting up realtime subscription:', error);
            }
        };

        setupRealtimeSubscription();

        return () => {
            if (channel) {
                console.log('Cleaning up subscription');
                supabase.removeChannel(channel);
            }
        };
    }, [isQROpen, selectedCoupon, refreshCouponData, setShowConfirmation, closeQRModal]);
};