// app/u/profile/apply-for-business/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getAddressDropdowns } from '@/actions/addressActions';
import { apiRequest } from '@/utils/apiUtils';
import VendorOnboardingForm from './components/VendorOnboardingForm';
import LoadingState from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

// Cache for categories to avoid repeated API calls
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchCategories = async () => {
    // Check if we have valid cached data
    if (categoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        return categoriesCache;
    }

    try {
        const response = await apiRequest('/api/vendors/categories', {
            method: 'GET',
        });

        if (response.success) {
            // Update cache
            categoriesCache = response;
            cacheTimestamp = Date.now();
            return response;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const submitVendorApplication = async (formData) => {
    try {
        const response = await apiRequest('/api/vendors/onboard', {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        return response;
    } catch (error) {
        console.error('Error submitting vendor application:', error);
        throw error;
    }
};

// Check if user already has a business (optional - for UX improvement)
const checkExistingBusiness = async () => {
    try {
        const response = await apiRequest('/api/vendors/my-business', {
            method: 'GET',
        });

        return response;
    } catch (error) {
        console.error('Error checking existing business:', error);
        return { success: false, data: null };
    }
};

export default function VendorOnboardingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        area: ''
    });
    const [dropdownData, setDropdownData] = useState({
        areaData: [],
        cityData: [],
        stateData: [],
        categories: []
    });

    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Check if user already has a business
                const existingBusinessResponse = await checkExistingBusiness();
                if (existingBusinessResponse.success && existingBusinessResponse.data) {
                    // User already has a business, redirect them
                    alert('You already have a registered business. Redirecting to dashboard...');
                    router.push('/coupons'); // or wherever you want to redirect
                    return;
                }

                // Fetch dropdown data and categories in parallel
                const [addressResponse, categoriesResponse] = await Promise.all([
                    getAddressDropdowns(),
                    fetchCategories()
                ]);

                // Handle address data
                if (!addressResponse.success) {
                    throw new Error(addressResponse.message || 'Failed to fetch address data');
                }

                // Handle categories data
                if (!categoriesResponse.success) {
                    throw new Error(categoriesResponse.message || 'Failed to fetch categories');
                }

                setDropdownData({
                    areaData: addressResponse.areaData || [],
                    cityData: addressResponse.cityData || [],
                    stateData: addressResponse.stateData || [],
                    categories: categoriesResponse.data || []
                });

            } catch (error) {
                console.error('Initialization error:', error);
                setError(error.message || 'Failed to load form data. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [router]);

    const handleSubmit = async (submittedFormData) => {
        try {
            const response = await submitVendorApplication(submittedFormData);

            if (response.success) {
                alert("Vendor application submitted successfully!");
                router.push('/coupons');
                return;
            }

            // Handle specific error cases
            if (response.status === 409) {
                alert(response.message);
                router.push('/dashboard?tab=business');
                return;
            }

            // Handle validation errors
            if (response.errors) {
                const errorMessages = Object.entries(response.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                    .join('\n');
                alert(`Validation errors:\n${errorMessages}`);
                return;
            }

            alert(response.message || 'Failed to submit application');

        } catch (error) {
            console.error('Error submitting vendor form:', error);
            throw new Error('Network error occurred. Please check your connection and try again.');
        }
    };

    // Loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Error state
    if (error && !isLoading) {
        return <ErrorState error={error} />;
    }

    return (
        <div className="min-h-screen py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <VendorOnboardingForm
                    initialFormData={formData}
                    dropdownData={dropdownData}
                    onSubmit={handleSubmit}
                />
            </motion.div>
        </div>
    );
}