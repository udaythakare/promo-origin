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

export const useCouponData = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedArea, setSelectedArea] = useState('');
    const [lastRefreshed, setLastRefreshed] = useState(null);
    const [error, setError] = useState(null);

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

    // Fetch fresh data
    const refreshCouponData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const area = getSelectedArea();

            const response = area
                ? await fetchAreaCoupons(area)
                : await fetchAllCoupons();

            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
            } else {
                throw new Error('No coupons data received');
            }
        } catch (error) {
            console.error('Error refreshing coupon data:', error);
            setError(`Failed to refresh coupons: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearFilters = async () => {
        setLoading(true);
        setError(null);
        clearAllFilters();
        setSelectedArea('');

        try {
            const response = await fetchAllCoupons();
            if (response?.coupons) {
                setCoupons(response.coupons);
                saveCoupons(response.coupons);
                setLastRefreshed(new Date());
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
        setCoupons(getCoupons());
        setLoading(getLoadingState());
        setSelectedArea(getSelectedArea());

        // Set up event listeners for state changes
        window.addEventListener('coupons-updated', handleCouponsUpdated);
        window.addEventListener('area-updated', handleAreaUpdated);
        window.addEventListener('loading-updated', handleLoadingUpdated);
        window.addEventListener('filters-cleared', handleFilterCleared);

        // Check if we need to fetch fresh data
        if (getCoupons().length === 0 || areCouponsStale()) {
            refreshCouponData();
        } else {
            setLastRefreshed(new Date());
        }

        // Set up periodic refresh
        const refreshInterval = setInterval(() => {
            if (shouldRefreshData()) {
                refreshCouponData();
            }
        }, 60000);

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
        setError,
        refreshCouponData,
        clearFilters
    };
};