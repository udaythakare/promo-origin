import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllCoupons, fetchAreaCoupons, fetchLocationBasedCoupons } from '@/actions/couponActions';
import {
    getCoupons,
    getSelectedArea,
    getLoadingState,
    saveCoupons,
    clearAllFilters,
    shouldRefreshData,
    areCouponsStale,
    saveLocationSource,
    getLocationSource,
    getLocationName
} from '@/helpers/couponStateManager';

const ITEMS_PER_PAGE = 5;

export const useCouponData = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedArea, setSelectedArea] = useState('');
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);
    const [locationSource, setLocationSource] = useState('all');
    const [locationName, setLocationName] = useState('');

    // Infinite scroll states
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    // Use ref to prevent initial load from running multiple times
    const hasInitialized = useRef(false);
    // Cache detected city from IP geolocation
    const detectedCity = useRef(null);

    console.log(coupons, "coupons in useCouponData");

    // Helper to detect city from IP
    const detectCity = async () => {
        if (detectedCity.current) return detectedCity.current;
        try {
            const res = await fetch('/api/geo');
            const data = await res.json();
            if (data?.success && data?.city) {
                detectedCity.current = data.city;
                return data.city;
            }
        } catch (err) {
            console.error('Failed to detect city from IP:', err);
        }
        return null;
    };

    // Memoized handler functions
    const handleCouponsUpdated = useCallback(() => {
        const newCoupons = getCoupons();
        setCoupons(newCoupons);
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

    // Fetch initial data or refresh - MEMOIZED PROPERLY
    const refreshCouponData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Reset pagination
            setPage(0);
            setHasMore(true);
            setCoupons([]);

            const area = getSelectedArea();
            let response;

            if (area) {
                // If user manually selected an area, use that
                response = await fetchAreaCoupons(area, {
                    limit: ITEMS_PER_PAGE,
                    offset: 0,
                    includeCount: true
                });
                // Manual area selection doesn't set locationSource
            } else {
                // Use location-based fetching (auto-detect city from IP)
                const city = await detectCity();
                response = await fetchLocationBasedCoupons({
                    city,
                    limit: ITEMS_PER_PAGE,
                    offset: 0,
                    includeCount: true
                });

                // Update location source info
                if (response?.locationSource) {
                    setLocationSource(response.locationSource);
                    setLocationName(response.locationName || '');
                    saveLocationSource(response.locationSource, response.locationName);
                }
            }

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
    }, []); // Empty dependency array since it doesn't depend on any state

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

                // Prevent duplicates by checking existing IDs
                setCoupons(prev => {
                    const existingIds = new Set(prev.map(c => c.id));
                    const uniqueNewCoupons = newCoupons.filter(coupon => !existingIds.has(coupon.id));

                    if (uniqueNewCoupons.length === 0) {
                        setHasMore(false);
                        return prev;
                    }

                    const updated = [...prev, ...uniqueNewCoupons];
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

    // Clear filters and reset to location-based auto-detection
    const clearFilters = useCallback(async () => {
        setLoading(true);
        setError(null);
        clearAllFilters();
        setSelectedArea('');

        // Reset pagination
        setPage(0);
        setHasMore(true);
        setCoupons([]);

        try {
            // Revert to location-based fetching (auto-detect city from IP)
            const city = await detectCity();
            const response = await fetchLocationBasedCoupons({
                city,
                limit: ITEMS_PER_PAGE,
                offset: 0,
                includeCount: true
            });

            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
                setPage(1);

                // Update location source info
                if (response?.locationSource) {
                    setLocationSource(response.locationSource);
                    setLocationName(response.locationName || '');
                    saveLocationSource(response.locationSource, response.locationName);
                }

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
    }, []);

    // Initial setup effect - RUNS ONLY ONCE
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

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

        // Clean up event listeners on unmount
        return () => {
            window.removeEventListener('coupons-updated', handleCouponsUpdated);
            window.removeEventListener('area-updated', handleAreaUpdated);
            window.removeEventListener('loading-updated', handleLoadingUpdated);
            window.removeEventListener('filters-cleared', handleFilterCleared);
        };
    }, []); // Empty dependency array - runs only once

    // Separate effect for periodic refresh
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            if (shouldRefreshData()) {
                refreshCouponData();
            }
        }, 300000); // 5 minutes

        return () => clearInterval(refreshInterval);
    }, [refreshCouponData]);

    return {
        coupons,
        loading,
        selectedArea,
        lastRefreshed,
        error,
        hasMore,
        totalCount,
        locationSource,
        locationName,
        setError,
        refreshCouponData,
        clearFilters,
        loadMoreCoupons
    };
};