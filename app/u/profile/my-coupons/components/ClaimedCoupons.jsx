'use client';
import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Store, Calendar, QrCode, RefreshCw } from 'lucide-react';
import { getUserId } from '@/helpers/userHelper';
import QRModal from '../../components/QRModal';
import { supabase } from '@/lib/supabase';
import { revalidateMyCouponPage } from '@/actions/revalidateActions';

export default function ClaimedCoupons({ data: initialData, onDataUpdate }) {
    const [data, setData] = useState(initialData);
    const { success, coupons } = data || { success: false, coupons: [] };

    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [userId, setUserId] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await getUserId();
                setUserId(id);
            } catch (error) {
                console.error("Failed to get user ID:", error);
            }
        };
        fetchUserId();
    }, []);

    const refreshData = async () => {
        try {
            const response = await fetch('/api/profile/user-claimed-coupon', {
                credentials: 'include',
            });
            if (response.ok) {
                const newData = await response.json();
                setData(newData);
                if (onDataUpdate) onDataUpdate(newData);
            }
        } catch (error) {
            console.error('Failed to refresh data:', error);
        }
    };

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
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
                    refreshData();
                    const updatedCoupon = payload.new;
                    if (
                        payload.eventType === 'UPDATE' &&
                        updatedCoupon?.coupon_status === 'redeemed'
                    ) {
                        if (
                            isQROpen &&
                            selectedCoupon &&
                            selectedCoupon.id === updatedCoupon.id
                        ) {
                            setShowConfirmation(true);
                            setTimeout(() => {
                                setIsQROpen(false);
                                setShowConfirmation(false);
                                setSelectedCoupon(null);
                            }, 3000);
                        }
                        revalidateMyCouponPage();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, isQROpen, selectedCoupon]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const showQrCode = (coupon) => {
        setIsQROpen(true);
        setSelectedCoupon(coupon);
        setShowConfirmation(false);
    };

    const closeQRModal = () => {
        setIsQROpen(false);
        setShowConfirmation(false);
        setSelectedCoupon(null);
    };

    const getQrValue = () => {
        if (!selectedCoupon || !userId) return '';
        return JSON.stringify({
            userId: userId,
            couponId: selectedCoupon.coupon_id
        });
    };

    return (
        <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-black text-black uppercase flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Claimed Coupons
                </h2>
                <button
                    onClick={refreshData}
                    className="bg-yellow-300 text-black font-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:scale-95 flex items-center gap-1"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Coupon Cards */}
            {success && coupons && coupons.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon.id || `coupon-${Math.random()}`}
                            className="bg-white border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all p-3 sm:p-4 flex flex-col justify-between"
                        >
                            {/* Business Name */}
                            <div className="flex items-center gap-2 mb-2">
                                <Store className="w-4 h-4 flex-shrink-0" />
                                <span className="font-black text-sm sm:text-base leading-tight truncate">
                                    {coupon.coupons?.businesses?.name || 'Business Name'}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 leading-snug line-clamp-2">
                                {coupon.coupons?.description || 'No description available'}
                            </p>

                            {/* Coupon Title Badge */}
                            <div className="font-black text-sm sm:text-base bg-yellow-300 px-3 py-1.5 border-2 border-black text-center mb-2">
                                {coupon.coupons?.title || 'Coupon'}
                            </div>

                            {/* Date + Status Row */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center text-xs font-semibold text-gray-600">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(coupon.coupons?.end_date)}
                                </div>
                                <span
                                    className={`text-xs font-black px-2 py-0.5 border-2 border-black ${coupon.coupon_status === 'claimed'
                                            ? 'bg-green-400'
                                            : coupon.coupon_status === 'redeemed'
                                                ? 'bg-blue-400'
                                                : 'bg-red-400'
                                        }`}
                                >
                                    {(coupon.coupon_status || 'UNKNOWN').toUpperCase()}
                                </span>
                            </div>

                            {/* QR Button */}
                            <button
                                className="w-full bg-black text-white text-xs sm:text-sm font-black px-4 py-2 hover:bg-gray-800 transition disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2"
                                onClick={() => showQrCode(coupon)}
                                disabled={coupon.coupon_status === 'redeemed'}
                            >
                                <QrCode className="w-4 h-4" />
                                {coupon.coupon_status === 'redeemed' ? 'USED' : 'SHOW QR'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-10 px-4 text-center bg-white border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <p className="font-black text-base sm:text-lg mb-1">
                        No claimed coupons yet
                    </p>
                    <p className="font-bold text-xs sm:text-sm text-gray-500">
                        Find deals in your area now!
                    </p>
                </div>
            )}

            {isQROpen && selectedCoupon && (
                <QRModal
                    isOpen={isQROpen}
                    onClose={closeQRModal}
                    qrValue={getQrValue()}
                    couponTitle={selectedCoupon.coupons?.title || 'Coupon'}
                    showConfirmation={showConfirmation}
                />
            )}
        </div>
    );
}
