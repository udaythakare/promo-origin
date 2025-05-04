// couponStateManager.js
// This file will handle the shared state between components

// Keys for localStorage
const STORAGE_KEYS = {
    COUPONS: 'app_coupons',
    SELECTED_AREA: 'app_selected_area',
    LOADING: 'app_loading_state'
};

// Function to save coupons to localStorage
export const saveCoupons = (coupons) => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    // Dispatch a custom event to notify components of the change
    window.dispatchEvent(new CustomEvent('coupons-updated'));
};

// Function to get coupons from localStorage
export const getCoupons = () => {
    const couponsStr = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return couponsStr ? JSON.parse(couponsStr) : [];
};

// Function to save selected area to localStorage
export const saveSelectedArea = (area) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_AREA, area || '');
    // Dispatch a custom event to notify components of the change
    window.dispatchEvent(new CustomEvent('area-updated'));
};

// Function to get selected area from localStorage
export const getSelectedArea = () => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_AREA) || '';
};

// Function to save loading state
export const saveLoadingState = (isLoading) => {
    localStorage.setItem(STORAGE_KEYS.LOADING, JSON.stringify(isLoading));
    // Dispatch a custom event to notify components of the change
    window.dispatchEvent(new CustomEvent('loading-updated'));
};

// Function to get loading state
export const getLoadingState = () => {
    const loadingStr = localStorage.getItem(STORAGE_KEYS.LOADING);
    return loadingStr ? JSON.parse(loadingStr) : false;
};

// Function to clear all filters
export const clearAllFilters = () => {
    saveSelectedArea('');
    // Don't clear the coupons yet, as we'll need to fetch all coupons separately
    window.dispatchEvent(new CustomEvent('filters-cleared'));
};