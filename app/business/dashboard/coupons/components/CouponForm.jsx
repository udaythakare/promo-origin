'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    createCoupon,
    updateCoupon,
    getUserBusinesses,
} from '../actions/couponActions';
import { prepareFormDataForSubmission } from '@/utils/dateUtils';

export default function CouponForm({ coupon }) {
    const router = useRouter();
    const isEditing = !!coupon?.id;

    // State for dropdown data
    const [businesses, setBusinesses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWarning, setShowWarning] = useState(false);

    const formatDateTimeForInput = (isoString) => {
        if (!isoString) return '';
        // ISO format from DB: 2025-05-09 21:00:00 or 2025-05-09T21:00:00Z
        // Convert to format required by datetime-local: YYYY-MM-DDThh:mm

        // Handle both ISO format and PostgreSQL timestamp format
        const dateObj = new Date(isoString.replace(' ', 'T'));
        if (isNaN(dateObj.getTime())) return '';

        return dateObj.toISOString().slice(0, 16); // Gets YYYY-MM-DDThh:mm
    };



    // Calculate current date and time for validation
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().split('.')[0].slice(0, -3); // Format: YYYY-MM-DDThh:mm
    };

    // Set default start date to current time and end date to 30 days from now
    const [formData, setFormData] = useState({
        business_id: '',
        title: '',
        description: '',
        start_date: formatDateTimeForInput(new Date().toISOString()),
        end_date: formatDateTimeForInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
        is_active: true,
        image_url: '',
        coupon_type: 'redeem_at_store',
        redeem_duration: '5 minutes',
        max_claims: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function loadInitialData() {
            setIsLoading(true);
            try {
                // Get businesses owned by the user
                const businessesResult = await getUserBusinesses();
                if (businessesResult.businesses) {
                    setBusinesses(businessesResult.businesses);

                    // If editing, set form data from coupon
                    if (isEditing && coupon) {
                        // // console.log('Original coupon data:', coupon); // Debug log
                        // Keep the original date strings for debugging
                        setFormData(prev => ({
                            ...prev,
                            ...coupon,
                            // Don't modify the original date strings yet
                        }));
                    } else if (businessesResult.businesses.length > 0) {
                        // Select first business by default for new coupons
                        setFormData(prev => ({
                            ...prev,
                            business_id: businessesResult.businesses[0].id
                        }));
                    }
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadInitialData();
    }, [isEditing, coupon]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show warning before submitting if not already confirmed
        if (!showWarning) {
            setShowWarning(true);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare form data for submission
            const submissionData = prepareFormDataForSubmission(formData);

            // Log the dates before submission (for debugging)
            // // // // // // // console.log('Submitting dates:', {
            start: submissionData.start_date,
                end: submissionData.end_date
        });

        // Save coupon
        let result;
        if (isEditing && coupon?.id) {
            result = await updateCoupon(coupon.id, submissionData);
        } else {
            result = await createCoupon(submissionData);
        }

        if (result.error) {
            setErrors({
                form: result.error
            });
            return;
        }

        router.push('/business/dashboard/coupons');
        router.refresh();
    } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({
            form: 'Failed to save coupon. Please try again.'
        });
    } finally {
        setIsSubmitting(false);
    }
};


const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (!formData.business_id) {
        newErrors.business_id = 'Please select a business';
    }

    if (!formData.title.trim()) {
        newErrors.title = 'Coupon title is required';
    }

    if (!formData.start_date) {
        newErrors.start_date = 'Start date is required';
    } else if (startDate < now && !isEditing) {
        // Only validate future dates for new coupons
        newErrors.start_date = 'Start date must be in the future';
    }

    if (!formData.end_date) {
        newErrors.end_date = 'End date is required';
    } else if (endDate <= startDate) {
        newErrors.end_date = 'End date must be after start date';
    } else if (endDate < now && !isEditing) {
        // Only validate future dates for new coupons
        newErrors.end_date = 'End date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

// Cancel warning and continue editing
const handleCancelWarning = () => {
    setShowWarning(false);
};

// Format date for better display in the UI
const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const formatDateForInput = (dateTimeString) => {
    if (!dateTimeString) return '';

    // First make sure the date is in a format JavaScript can parse
    let dateObj;
    if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
        // Convert "2025-05-09 21:00:00" format to "2025-05-09T21:00:00"
        dateObj = new Date(dateTimeString.replace(' ', 'T'));
    } else {
        dateObj = new Date(dateTimeString);
    }

    if (isNaN(dateObj.getTime())) return '';

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';

    // First make sure the date is in a format JavaScript can parse
    let dateObj;
    if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
        // Convert "2025-05-09 21:00:00" format to "2025-05-09T21:00:00"
        dateObj = new Date(dateTimeString.replace(' ', 'T'));
    } else {
        dateObj = new Date(dateTimeString);
    }

    if (isNaN(dateObj.getTime())) return '';

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};
const combineDateTime = (dateValue, timeValue) => {
    if (!dateValue || !timeValue) return '';
    return `${dateValue}T${timeValue}:00`;
};

// Display time in 12-hour format with AM/PM
const format12HourTime = (dateTimeString) => {
    if (!dateTimeString) return '';

    let dateObj;
    if (typeof dateTimeString === 'string' && dateTimeString.includes(' ')) {
        // Convert "2025-05-09 21:00:00" format to "2025-05-09T21:00:00"
        dateObj = new Date(dateTimeString.replace(' ', 'T'));
    } else {
        dateObj = new Date(dateTimeString);
    }

    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};

// Format time for better display in the UI
const formatTimeForDisplay = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Get current date in YYYY-MM-DD format for min attribute
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Handle date change with validation for future dates
const handleDateChange = (e, fieldName) => {
    const { value } = e.target;
    const timeValue = formatTimeForDisplay(formData[fieldName]);
    const selectedDate = new Date(`${value}T${timeValue}`);
    const now = new Date();

    // If selected date is in the past, use current date instead
    if (selectedDate < now) {
        const currentDate = getCurrentDate();
        const currentTime = formatTimeForDisplay(getCurrentDateTime());
        const newDateTime = `${currentDate}T${currentTime}`;

        setFormData(prev => ({
            ...prev,
            [fieldName]: newDateTime
        }));

        if (fieldName === 'start_date') {
            setErrors(prev => ({
                ...prev,
                start_date: 'Updated to current date and time - past dates not allowed'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                end_date: 'Updated to current date and time - past dates not allowed'
            }));
        }
    } else {
        const newDateTime = `${value}T${timeValue}`;

        setFormData(prev => ({
            ...prev,
            [fieldName]: newDateTime
        }));

        // Clear error for this field if it exists
        if (errors[fieldName]) {
            const updatedErrors = { ...errors };
            delete updatedErrors[fieldName];
            setErrors(updatedErrors);
        }
    }
};



// Handle time change with validation for future times
const handleTimeChange = (e, fieldName) => {
    const { value } = e.target;
    const dateValue = formatDateForDisplay(formData[fieldName]);
    const selectedDateTime = new Date(`${dateValue}T${value}`);
    const now = new Date();

    // If selected date+time is in the past, use current time instead
    if (selectedDateTime < now) {
        const currentTime = formatTimeForDisplay(getCurrentDateTime());
        const newDateTime = `${dateValue}T${currentTime}`;

        setFormData(prev => ({
            ...prev,
            [fieldName]: newDateTime
        }));

        if (fieldName === 'start_date') {
            setErrors(prev => ({
                ...prev,
                start_date: 'Updated to current time - past times not allowed'
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                end_date: 'Updated to current time - past times not allowed'
            }));
        }
    } else {
        const newDateTime = `${dateValue}T${value}`;

        setFormData(prev => ({
            ...prev,
            [fieldName]: newDateTime
        }));

        // Clear error for this field if it exists
        if (errors[fieldName]) {
            const updatedErrors = { ...errors };
            delete updatedErrors[fieldName];
            setErrors(updatedErrors);
        }
    }
};

if (isLoading) {
    return (
        <div className="flex justify-center items-center h-48">
            <div className="text-blue-600 font-bold">Loading...</div>
        </div>
    );
}

return (
    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 max-w-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-black mb-6 border-b-4 border-black pb-2">
            {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
        </h2>

        {/* Warning Modal */}
        {showWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full">
                    <h3 className="text-xl font-black mb-4">⚠️ Important Warning</h3>
                    <p className="mb-6 font-medium">
                        Once this coupon is claimed by any user, you will <span className="font-bold underline">NOT</span> be able to edit or delete it.
                        You can only edit or delete coupons that have not been claimed yet.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={handleCancelWarning}
                            className="px-4 py-2 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-green-200 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold"
                        >
                            I Understand, Continue
                        </button>
                    </div>
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Business Selection */}
            <div className="space-y-2">
                <label className="block font-bold text-lg">Business</label>
                <select
                    name="business_id"
                    value={formData.business_id}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                    required
                >
                    <option value="">Select a business</option>
                    {businesses.map((business) => (
                        <option key={business.id} value={business.id}>
                            {business.name}
                        </option>
                    ))}
                </select>
                {errors.business_id && <p className="text-red-500 font-medium">{errors.business_id}</p>}
            </div>

            {/* Title */}
            <div className="space-y-2">
                <label className="block font-bold text-lg">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                    placeholder="e.g. 20% Off All Items"
                    required
                />
                {errors.title && <p className="text-red-500 font-medium">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="block font-bold text-lg">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 min-h-[100px] text-base"
                    placeholder="Describe the coupon details and any terms & conditions"
                    required
                />
            </div>

            {/* Coupon Type */}
            <div className="space-y-2">
                <label className="block font-bold text-lg">Coupon Type</label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coupon_type: 'redeem_at_store' }))}
                        className={`p-3 border-2 border-black font-bold ${formData.coupon_type === 'redeem_at_store'
                            ? 'bg-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'} 
                                transition-all`}
                    >
                        Redeem In-Store
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coupon_type: 'redeem_online' }))}
                        className={`p-3 border-2 border-black font-bold ${formData.coupon_type === 'redeem_online'
                            ? 'bg-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'} 
                                transition-all`}
                    >
                        Redeem Online
                    </button>
                </div>
            </div>

            {/* Date and Time Fields - For both coupon types */}
            <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date & Time */}
                    <div className="space-y-2">
                        <label className="block font-bold text-lg">Start Date & Time</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={formatDateForInput(formData.start_date)}
                                onChange={(e) => {
                                    const newDateTime = combineDateTime(
                                        e.target.value,
                                        formatTimeForInput(formData.start_date)
                                    );
                                    setFormData(prev => ({
                                        ...prev,
                                        start_date: newDateTime
                                    }));
                                }}
                                className="p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                                required
                            />
                            <input
                                type="time"
                                value={formatTimeForInput(formData.start_date)}
                                onChange={(e) => {
                                    const newDateTime = combineDateTime(
                                        formatDateForInput(formData.start_date),
                                        e.target.value
                                    );
                                    setFormData(prev => ({
                                        ...prev,
                                        start_date: newDateTime
                                    }));
                                }}
                                className="p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                                required
                            />
                        </div>
                        {errors.start_date && <p className="text-red-500 font-medium">{errors.start_date}</p>}

                        {/* Debug display of the actual timestamp */}
                        {isEditing && (
                            <div className="text-xs text-gray-500">
                                Original value: {format12HourTime(coupon?.start_date)}
                            </div>
                        )}
                    </div>

                    {/* End Date & Time */}
                    <div className="space-y-2">
                        <label className="block font-bold text-lg">End Date & Time</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                                type="date"
                                value={formatDateForInput(formData.end_date)}
                                onChange={(e) => {
                                    const newDateTime = combineDateTime(
                                        e.target.value,
                                        formatTimeForInput(formData.end_date)
                                    );
                                    setFormData(prev => ({
                                        ...prev,
                                        end_date: newDateTime
                                    }));
                                }}
                                className="p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                                required
                            />
                            <input
                                type="time"
                                value={formatTimeForInput(formData.end_date)}
                                onChange={(e) => {
                                    const newDateTime = combineDateTime(
                                        formatDateForInput(formData.end_date),
                                        e.target.value
                                    );
                                    setFormData(prev => ({
                                        ...prev,
                                        end_date: newDateTime
                                    }));
                                }}
                                className="p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                                required
                            />
                        </div>
                        {errors.end_date && <p className="text-red-500 font-medium">{errors.end_date}</p>}

                        {/* Debug display of the actual timestamp */}
                        {isEditing && (
                            <div className="text-xs text-gray-500">
                                Original value: {format12HourTime(coupon?.end_date)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Date-Time Validation Notice */}
            <div className="bg-blue-100 border-2 border-blue-500 p-3 text-blue-800">
                <p className="font-medium">
                    <strong>📅 Note:</strong> Only future dates and times can be selected. If you select a past date or time, it will automatically update to the current date and time.
                </p>
            </div>

            {/* Redemption Duration - Only for in-store redemptions */}
            {formData.coupon_type === 'redeem_at_store' && (
                <div className="space-y-2">
                    <label className="block font-bold text-lg">Redemption Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, redeem_duration: '5 minutes' }))}
                            className={`p-3 border-2 border-black font-bold ${formData.redeem_duration === '5 minutes'
                                ? 'bg-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'} 
                                    transition-all`}
                        >
                            5 Minutes
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, redeem_duration: '10 minutes' }))}
                            className={`p-3 border-2 border-black font-bold ${formData.redeem_duration === '10 minutes'
                                ? 'bg-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'} 
                                    transition-all`}
                        >
                            10 Minutes
                        </button>
                    </div>
                </div>
            )}

            {/* Max Claims */}
            <div className="space-y-2">
                <label className="block font-bold text-lg">Max Claims</label>
                <input
                    type="number"
                    name="max_claims"
                    placeholder="Leave blank for unlimited"
                    value={formData.max_claims}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                />
                <p className="text-sm text-gray-600">Leave blank for unlimited claims</p>
            </div>

            {/* Error message */}
            {errors.form && (
                <div className="bg-red-100 border-2 border-red-500 p-3 text-red-700">
                    {errors.form}
                </div>
            )}

            {/* Important Warning Notice */}
            <div className="bg-yellow-100 border-2 border-yellow-500 p-3 text-yellow-800">
                <p className="font-medium">
                    <strong>⚠️ Important:</strong> Once this coupon is claimed by any user, you will NOT be able to edit or delete it.
                </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-green-200 border-3 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Coupon' : 'Create Coupon'}
                </button>
            </div>

            {/* Add this near the top of your return statement, before the form */}
            {isEditing && coupon && (
                <div className="bg-blue-100 border-2 border-blue-500 p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">Original Coupon Times</h3>
                    <p><strong>Start:</strong> {new Date(coupon.start_date.replace(' ', 'T')).toLocaleString()} ({coupon.start_date})</p>
                    <p><strong>End:</strong> {new Date(coupon.end_date.replace(' ', 'T')).toLocaleString()} ({coupon.end_date})</p>
                    <p className="text-sm mt-2">
                        Times shown in 12-hour format:
                        Start: {format12HourTime(coupon.start_date)} |
                        End: {format12HourTime(coupon.end_date)}
                    </p>
                </div>
            )}


        </form>
    </div>
);
}