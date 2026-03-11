'use client';

import { useCouponClaim } from '@/hooks/useCouponClaim';
import { useCouponData } from '@/hooks/useCouponData';
import { useQRCode } from '@/hooks/useQRCode';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import React, { useState, useEffect, useRef } from 'react';
import { ErrorDisplay } from './GlobalCouponComp/ErrorDisplay';
import { CouponHeader } from './GlobalCouponComp/CouponHeader';
import { CouponCard } from './GlobalCouponComp/CouponCard/CouponCard';
import { useRealtimeUpdates } from '@/hooks/useRealtimeSubscription';
import { EmptyState } from './GlobalCouponComp/EmptyState';
import { LoadingSpinner } from './GlobalCouponComp/LoadingSpinner';
import QRModal from '@/app/u/profile/components/QRModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── emoji map for categories ──────────────────────────────────────────────────
const CATEGORY_ICONS = {
    'beauty': '💅', 'spa': '🧖', 'beauty & spa': '💅',
    'things to do': '🎯', 'health': '💪', 'fitness': '🏋️',
    'health & fitness': '💪', 'automotive': '🚗', 'retail': '🛍️',
    'food': '🍽️', 'drink': '🍹', 'food & drink': '🍽️',
    'personal services': '✂️', 'home services': '🏠', 'gift cards': '🎁',
    'travel': '✈️', 'education': '📚', 'technology': '💻',
    'fashion': '👗', 'clothing': '👕', 'grocery': '🛒',
    'pharmacy': '💊', 'entertainment': '🎬', 'sports': '⚽',
    'pets': '🐾', 'bakery': '🥐', 'electronics': '📱',
    'furniture': '🛋️', 'medical': '🏥', 'jewellery': '💎',
};

function getCategoryIcon(name = '') {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
        if (lower.includes(key)) return icon;
    }
    return '🏷️';
}

// ── Category pill button ──────────────────────────────────────────────────────
function CategoryPill({ category, isActive, onClick }) {
    return (
        <button
            onClick={() => onClick(category)}
            aria-pressed={isActive}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 16px',
                borderRadius: '24px',
                border: `1.5px solid ${isActive ? '#3716a8' : '#e5e7eb'}`,
                background: isActive ? '#3716a8' : 'white',
                color: isActive ? 'white' : '#374151',
                fontSize: '0.82rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: isActive
                    ? '0 4px 16px rgba(55,22,168,0.35)'
                    : '0 1px 4px rgba(0,0,0,0.06)',
                transform: isActive ? 'translateY(-1px)' : 'none',
                transition: 'all 0.18s ease',
                fontFamily: 'inherit',
            }}
        >
            <span style={{ fontSize: '1rem', lineHeight: 1 }}>
                {getCategoryIcon(category.name)}
            </span>
            <span>{category.name}</span>
        </button>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
const GlobalCouponSection = ({ userId }) => {
    const [session] = useState(true);
    const [detailsOpen, setDetailsOpen] = useState(null);

    // ── Category state ────────────────────────────────────────────────────
    const [categories, setCategories] = useState([]);
    const [catLoading, setCatLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null); // null = All
    const [filteredCoupons, setFilteredCoupons] = useState(null); // null = show all from hook
    const [catFetching, setCatFetching] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const scrollRef = useRef(null);

    // ── Existing hooks (unchanged) ────────────────────────────────────────
    const {
        coupons,
        loading,
        lastRefreshed,
        error,
        hasMore,
        totalCount,
        locationSource,
        locationName,
        setError,
        refreshCouponData,
        clearFilters,
        loadMoreCoupons,
    } = useCouponData();

    // When a category is active show filteredCoupons, otherwise show hook coupons
    const displayCoupons = filteredCoupons !== null ? filteredCoupons : coupons;

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

    const [targetRef, isFetchingMore] = useInfiniteScroll(loadMoreCoupons, hasMore);

    useRealtimeUpdates(
        isQROpen,
        selectedCoupon,
        refreshCouponData,
        setShowConfirmation,
        closeQRModal
    );

    // ── Load categories from Supabase ─────────────────────────────────────
    useEffect(() => {
        const loadCategories = async () => {
            setCatLoading(true);
            try {
                const { data, error } = await supabase
                    .from('business_categories')
                    .select('id, name')
                    .order('name', { ascending: true });

                if (!error && data) setCategories(data);
            } catch (e) {
                console.error('Failed to load categories:', e);
            } finally {
                setCatLoading(false);
            }
        };
        loadCategories();
    }, []);

    // ── Scroll arrow visibility ───────────────────────────────────────────
    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        checkScroll();
        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [categories]);

    const scrollBy = (dir) => {
        scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
    };

    // ── Category filter logic ─────────────────────────────────────────────
    const handleCategoryClick = async (cat) => {
        // Toggle off if same category clicked again
        if (selectedCategory?.id === cat.id) {
            setSelectedCategory(null);
            setFilteredCoupons(null);
            return;
        }

        setSelectedCategory(cat);
        setCatFetching(true);

        try {
            const { data: businesses } = await supabase
                .from('businesses')
                .select('id')
                .eq('category_id', cat.id);

            if (!businesses || businesses.length === 0) {
                setFilteredCoupons([]);
                return;
            }

            const bizIds = businesses.map(b => b.id);

            const { data: categoryCoupons } = await supabase
                .from('coupons')
                .select(`
                    *,
                    businesses(
                        name,
                        business_locations(
                            address, area, city, state, postal_code
                        )
                    )
                `)
                .in('business_id', bizIds)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            setFilteredCoupons(categoryCoupons || []);
        } catch (e) {
            console.error('Error filtering by category:', e);
            setFilteredCoupons([]);
        } finally {
            setCatFetching(false);
        }
    };

    const handleClearCategory = async () => {
        setSelectedCategory(null);
        setFilteredCoupons(null);
    };

    // ── Utilities ─────────────────────────────────────────────────────────
    const isCouponClaimed = (couponId) => {
        const coupon = displayCoupons.find(c => c.id === couponId);
        return coupon?.is_claimed || false;
    };

    const toggleDetails = (couponId) => {
        setDetailsOpen(detailsOpen === couponId ? null : couponId);
    };

    return (
        <div className="container mx-auto py-6 px-4">

            {/* ── CATEGORY BAR ─────────────────────────────────────────────── */}
            <div style={{ marginBottom: '1.5rem' }}>

                {/* Header row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '1.4rem',
                            fontWeight: 800,
                            color: '#0f0c1d',
                            margin: '0 0 2px',
                            letterSpacing: '-0.4px',
                        }}>
                            Discover Local Deals
                        </h2>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0, fontWeight: 500 }}>
                            {selectedCategory
                                ? `Showing coupons in "${selectedCategory.name}"`
                                : 'Browse by category or explore all coupons'}
                        </p>
                    </div>

                    {selectedCategory && (
                        <button
                            onClick={handleClearCategory}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                background: 'rgba(55,22,168,0.07)',
                                border: '1.5px solid rgba(55,22,168,0.2)',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#3716a8',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            {getCategoryIcon(selectedCategory.name)} {selectedCategory.name}
                            <span style={{ marginLeft: 4, opacity: 0.7 }}>×</span>
                        </button>
                    )}
                </div>

                {/* Scrollable pill row */}
                <div style={{ position: 'relative' }}>

                    {/* Left arrow */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scrollBy(-1)}
                            aria-label="Scroll left"
                            style={{
                                position: 'absolute', left: -14, top: '50%',
                                transform: 'translateY(-50%)', zIndex: 10,
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'white', border: '1.5px solid rgba(55,22,168,0.25)',
                                boxShadow: '0 3px 12px rgba(55,22,168,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#3716a8',
                            }}
                        >
                            <ChevronLeft size={15} />
                        </button>
                    )}

                    {/* Pills track */}
                    <div
                        ref={scrollRef}
                        style={{
                            display: 'flex',
                            gap: '10px',
                            overflowX: 'auto',
                            scrollBehavior: 'smooth',
                            padding: '6px 4px 10px',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {/* All Coupons pill */}
                        <button
                            onClick={handleClearCategory}
                            aria-pressed={!selectedCategory}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '7px',
                                padding: '8px 18px',
                                borderRadius: '24px',
                                border: `1.5px solid ${!selectedCategory ? '#0f0c1d' : '#e5e7eb'}`,
                                background: !selectedCategory ? '#0f0c1d' : 'white',
                                color: !selectedCategory ? 'white' : '#374151',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                flexShrink: 0,
                                boxShadow: !selectedCategory
                                    ? '0 4px 14px rgba(15,12,29,0.25)'
                                    : '0 1px 4px rgba(0,0,0,0.06)',
                                transition: 'all 0.18s ease',
                                fontFamily: 'inherit',
                            }}
                        >
                            <LayoutGrid size={14} />
                            All Coupons
                        </button>

                        {/* Skeleton pills while loading */}
                        {catLoading && Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    height: 38,
                                    width: 90 + (i % 3) * 35,
                                    borderRadius: 24,
                                    flexShrink: 0,
                                    background: 'linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)',
                                    backgroundSize: '200% 100%',
                                    animation: 'cat-shimmer 1.4s ease infinite',
                                }}
                            />
                        ))}

                        {/* Real category pills */}
                        {!catLoading && categories.map(cat => (
                            <CategoryPill
                                key={cat.id}
                                category={cat}
                                isActive={selectedCategory?.id === cat.id}
                                onClick={handleCategoryClick}
                            />
                        ))}
                    </div>

                    {/* Right arrow */}
                    {canScrollRight && (
                        <button
                            onClick={() => scrollBy(1)}
                            aria-label="Scroll right"
                            style={{
                                position: 'absolute', right: -14, top: '50%',
                                transform: 'translateY(-50%)', zIndex: 10,
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'white', border: '1.5px solid rgba(55,22,168,0.25)',
                                boxShadow: '0 3px 12px rgba(55,22,168,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: '#3716a8',
                            }}
                        >
                            <ChevronRight size={15} />
                        </button>
                    )}
                </div>

                {/* shimmer keyframes */}
                <style>{`
                    @keyframes cat-shimmer {
                        0%   { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    /* hide scrollbar in webkit */
                    div::-webkit-scrollbar { display: none; }
                `}</style>

                {/* Result count when category selected */}
                {selectedCategory && !catFetching && (
                    <p style={{
                        fontSize: '0.78rem',
                        color: '#6b7280',
                        fontWeight: 500,
                        margin: '4px 0 0 4px',
                    }}>
                        {displayCoupons.length === 0
                            ? 'No coupons in this category'
                            : `${displayCoupons.length} coupon${displayCoupons.length !== 1 ? 's' : ''} found`}
                    </p>
                )}
            </div>

            {/* ── DIVIDER ──────────────────────────────────────────────────── */}
            <div style={{
                height: 1,
                background: 'linear-gradient(90deg,transparent,rgba(55,22,168,0.1),transparent)',
                marginBottom: '1.25rem',
            }} />

            {/* ── EXISTING CONTENT (completely unchanged below) ─────────────── */}
            <ErrorDisplay error={error} onClose={() => setError(null)} />

            <CouponHeader
                lastRefreshed={lastRefreshed}
                loading={loading}
                onRefresh={refreshCouponData}
                totalCount={totalCount}
                currentCount={displayCoupons.length}
                locationSource={locationSource}
                locationName={locationName}
            />

            {(loading || catFetching) && displayCoupons.length === 0 && <LoadingSpinner />}

            {!loading && !catFetching && displayCoupons.length === 0 && (
                <EmptyState onClearFilters={handleClearCategory} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
                {displayCoupons.map((coupon, index) => (
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

            {/* Infinite Scroll Trigger — only when no category filter active */}
            {hasMore && !selectedCategory && (
                <div ref={targetRef} className="flex justify-center py-8">
                    {isFetchingMore ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800" />
                            <span className="text-gray-600">Loading more coupons...</span>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm">Scroll down to load more coupons</div>
                    )}
                </div>
            )}

            {/* End of results */}
            {!hasMore && displayCoupons.length > 0 && (
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
                    qrValue={qrData}
                    showConfirmation={showConfirmation}
                />
            )}

            {/* Confirmation Modal */}
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
        </div>
    );
};

export default GlobalCouponSection;