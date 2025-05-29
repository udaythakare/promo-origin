import { useState, useEffect, useCallback } from 'react';
import { fetchAllCoupons, fetchAreaCoupons } from '@/actions/couponActions';
import {
    getCoupons,
    getSelectedArea,
    getLoadingState,
    saveCoupons,
    clearAllFilters,
    shouldRefreshData,
    areCouponsStale
} from '@/helpers/couponStateManager';

const ITEMS_PER_PAGE = 5; // Adjust this based on your needs

export const useCouponData = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedArea, setSelectedArea] = useState('');
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);

    // Infinite scroll states
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    console.log(coupons, "coupons in useCouponData");

    // Handler functions
    const handleCouponsUpdated = useCallback(() => {
        setCoupons(getCoupons());
        setLastRefreshed(new Date());
    }, []);

    const handleAreaUpdated = useCallback(() => {
        setSelectedArea(getSelectedArea());
    }, []);

    const handleLoadingUpdated = useCallback(() => {
        setLoading(getLoadingState());
    }, []);

    const handleFilterCleared = useCallback(() => {
        setSelectedArea('');
    }, []);

    // Reset pagination when area changes
    const resetPagination = useCallback(() => {
        setPage(0);
        setHasMore(true);
        setCoupons([]);
    }, []);

    // Fetch initial data or refresh
    const refreshCouponData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            resetPagination();

            const area = getSelectedArea();
            const response = area
                ? await fetchAreaCoupons(area, {
                    limit: ITEMS_PER_PAGE,
                    offset: 0,
                    includeCount: true
                })
                : await fetchAllCoupons({
                    limit: ITEMS_PER_PAGE,
                    offset: 0,
                    includeCount: true
                });

            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
                setPage(1);

                // Set total count and hasMore
                if (response.totalCount !== undefined) {
                    setTotalCount(response.totalCount);
                    setHasMore(response.coupons.length < response.totalCount);
                } else {
                    setHasMore(response.coupons.length === ITEMS_PER_PAGE);
                }
            } else {
                throw new Error('No coupons data received');
            }
        } catch (error) {
            console.error('Error refreshing coupon data:', error);
            setError(`Failed to refresh coupons: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [resetPagination]);

    // Load more coupons for infinite scroll
    const loadMoreCoupons = useCallback(async () => {
        if (!hasMore || loading) return;

        try {
            const area = getSelectedArea();
            const offset = page * ITEMS_PER_PAGE;

            const response = area
                ? await fetchAreaCoupons(area, {
                    limit: ITEMS_PER_PAGE,
                    offset,
                    includeCount: false
                })
                : await fetchAllCoupons({
                    limit: ITEMS_PER_PAGE,
                    offset,
                    includeCount: false
                });

            if (response?.coupons) {
                const newCoupons = response.coupons;

                setCoupons(prev => {
                    const updated = [...prev, ...newCoupons];
                    saveCoupons(updated);
                    return updated;
                });

                setPage(prev => prev + 1);

                // Check if we have more data
                if (totalCount > 0) {
                    setHasMore((page + 1) * ITEMS_PER_PAGE < totalCount);
                } else {
                    setHasMore(newCoupons.length === ITEMS_PER_PAGE);
                }
            }
        } catch (error) {
            console.error('Error loading more coupons:', error);
            setError(`Failed to load more coupons: ${error.message}`);
        }
    }, [hasMore, loading, page, totalCount]);

    // Clear filters and reset
    const clearFilters = async () => {
        setLoading(true);
        setError(null);
        clearAllFilters();
        setSelectedArea('');
        resetPagination();

        try {
            const response = await fetchAllCoupons({
                limit: ITEMS_PER_PAGE,
                offset: 0,
                includeCount: true
            });

            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
                setPage(1);

                if (response.totalCount !== undefined) {
                    setTotalCount(response.totalCount);
                    setHasMore(response.coupons.length < response.totalCount);
                } else {
                    setHasMore(response.coupons.length === ITEMS_PER_PAGE);
                }
            } else {
                throw new Error('No coupons data received');
            }
        } catch (error) {
            console.error('Error clearing filters:', error);
            setError(`Failed to clear filters: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Setup effect
    useEffect(() => {
        // Initial load from localStorage
        const storedCoupons = getCoupons();
        setCoupons(storedCoupons);
        setLoading(getLoadingState());
        setSelectedArea(getSelectedArea());

        // Set up event listeners for state changes
        window.addEventListener('coupons-updated', handleCouponsUpdated);
        window.addEventListener('area-updated', handleAreaUpdated);
        window.addEventListener('loading-updated', handleLoadingUpdated);
        window.addEventListener('filters-cleared', handleFilterCleared);

        // Check if we need to fetch fresh data
        if (storedCoupons.length === 0 || areCouponsStale()) {
            refreshCouponData();
        } else {
            setLastRefreshed(new Date());
            // Set initial pagination state based on stored data
            const initialPage = Math.ceil(storedCoupons.length / ITEMS_PER_PAGE);
            setPage(initialPage);
        }

        // Set up periodic refresh (optional - you might want to disable this with infinite scroll)
        const refreshInterval = setInterval(() => {
            if (shouldRefreshData()) {
                refreshCouponData();
            }
        }, 300000); // Increased to 5 minutes to be less aggressive

        // Clean up event listeners and interval
        return () => {
            window.removeEventListener('coupons-updated', handleCouponsUpdated);
            window.removeEventListener('area-updated', handleAreaUpdated);
            window.removeEventListener('loading-updated', handleLoadingUpdated);
            window.removeEventListener('filters-cleared', handleFilterCleared);
            clearInterval(refreshInterval);
        };
    }, [handleCouponsUpdated, handleAreaUpdated, handleLoadingUpdated, handleFilterCleared, refreshCouponData]);

    return {
        coupons,
        loading,
        selectedArea,
        lastRefreshed,
        error,
        hasMore,
        totalCount,
        setError,
        refreshCouponData,
        clearFilters,
        loadMoreCoupons
    };
};