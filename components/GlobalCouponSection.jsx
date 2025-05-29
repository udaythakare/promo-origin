'use client';

import { useCouponClaim } from '@/hooks/useCouponClaim';
import { useCouponData } from '@/hooks/useCouponData';
import { useQRCode } from '@/hooks/useQRCode';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import React, { useState } from 'react';
import { ErrorDisplay } from './GlobalCouponComp/ErrorDisplay';
import { CouponHeader } from './GlobalCouponComp/CouponHeader';
import { CouponCard } from './GlobalCouponComp/CouponCard/CouponCard';
import { useRealtimeUpdates } from '@/hooks/useRealtimeSubscription';
import { EmptyState } from './GlobalCouponComp/EmptyState';
import { LoadingSpinner } from './GlobalCouponComp/LoadingSpinner';
import QRModal from '@/app/u/profile/components/QRModal';
import { ConfirmationModal } from './ConfirmationModal';

const GlobalCouponSection = ({ userId }) => {
    const [session, setSession] = useState(true); // Assuming user is logged in by default
    const [detailsOpen, setDetailsOpen] = useState(null);

    // Custom hooks
    const {
        coupons,
        loading,
        lastRefreshed,
        error,
        hasMore,
        totalCount,
        setError,
        refreshCouponData,
        clearFilters,
        loadMoreCoupons
    } = useCouponData();

    const {
        claimingCoupons,
        pendingClaim,
        showModal,
        setShowModal,
        handleClaimCouponClick,
        handleConfirmClaim
    } = useCouponClaim(refreshCouponData);

    const {
        isQROpen,
        selectedCoupon,
        qrData,
        showConfirmation,
        setShowConfirmation,
        showQrCode,
        closeQRModal
    } = useQRCode();

    // Infinite scroll hook
    const [targetRef, isFetchingMore] = useInfiniteScroll(loadMoreCoupons, hasMore);

    // Realtime updates
    useRealtimeUpdates(
        isQROpen,
        selectedCoupon,
        refreshCouponData,
        setShowConfirmation,
        closeQRModal
    );

    // Utility functions
    const isCouponClaimed = (couponId) => {
        const coupon = coupons.find(c => c.id === couponId);
        return coupon?.is_claimed || false;
    };

    const toggleDetails = (couponId) => {
        setDetailsOpen(detailsOpen === couponId ? null : couponId);
    };

    return (
        <div className="container mx-auto py-6 px-4">
            <ErrorDisplay error={error} onClose={() => setError(null)} />

            <CouponHeader
                lastRefreshed={lastRefreshed}
                loading={loading}
                onRefresh={refreshCouponData}
                totalCount={totalCount}
                currentCount={coupons.length}
            />

            {loading && coupons.length === 0 && <LoadingSpinner />}

            {!loading && coupons.length === 0 && (
                <EmptyState onClearFilters={clearFilters} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                {coupons.map((coupon, index) => (
                    <CouponCard
                        key={coupon.id}
                        coupon={coupon}
                        index={index}
                        isClaimed={isCouponClaimed(coupon.id)}
                        claimingStatus={claimingCoupons[coupon.id]}
                        session={session}
                        onClaimClick={handleClaimCouponClick}
                        onShowQR={showQrCode}
                        onToggleDetails={toggleDetails}
                        detailsOpen={detailsOpen === coupon.id}
                        userId={userId}
                    />
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
                <div ref={targetRef} className="flex justify-center py-8">
                    {isFetchingMore ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
                            <span className="text-gray-600">Loading more coupons...</span>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm">
                            Scroll down to load more coupons
                        </div>
                    )}
                </div>
            )}

            {/* End of results indicator */}
            {!hasMore && coupons.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                    <div className="border-t border-gray-200 pt-4">
                        You've reached the end! No more coupons to load.
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {isQROpen && selectedCoupon && (
                <QRModal
                    isOpen={isQROpen}
                    onClose={closeQRModal}
                    coupon={selectedCoupon}
                    qrData={qrData}
                />
            )}

            {/* Confirmation Modal for Coupon Claims */}
            {showModal && pendingClaim && (
                <ConfirmationModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={handleConfirmClaim}
                    coupon={pendingClaim}
                    title="Confirm Coupon Claim"
                    message={`Are you sure you want to claim "${pendingClaim.title}"?`}
                />
            )}

            {/* QR Code Success/Confirmation Modal */}
            {showConfirmation && selectedCoupon && (
                <ConfirmationModal
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={() => setShowConfirmation(false)}
                    coupon={selectedCoupon}
                    title="QR Code Scanned Successfully"
                    message="Your coupon has been processed successfully!"
                    confirmText="OK"
                    showCancel={false}
                />
            )}
        </div>
    );
};

export default GlobalCouponSection;