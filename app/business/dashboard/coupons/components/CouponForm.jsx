// app/coupons/components/CouponForm.tsx (Client Component)
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    createCoupon,
    updateCoupon,
    getUserBusinesses,
    getBusinessLocations,
    getBusinessCategories,
    getBusinessProducts,
    getCouponTags
} from '../actions/couponActions';
import { uploadImage } from '../actions/uploadActions';
import Image from 'next/image';

// Default coupon images to use when no image is uploaded
const DEFAULT_COUPON_IMAGES = [
    'https://res.cloudinary.com/demo/image/upload/v1631234567/coupons/default_coupon1.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1631234568/coupons/default_coupon2.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1631234569/coupons/default_coupon3.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1631234570/coupons/default_coupon4.jpg',
    'https://res.cloudinary.com/demo/image/upload/v1631234571/coupons/default_coupon5.jpg',
];

export default function CouponForm({ coupon }) {
    const router = useRouter();
    const isEditing = !!coupon?.id;
    const fileInputRef = useRef(null);

    // State for dropdown data
    const [businesses, setBusinesses] = useState([]);
    const [businessLocations, setBusinessLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Image upload states
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const [formData, setFormData] = useState({
        business_id: '',
        code: '',
        title: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        minimum_purchase: 0,
        applies_to: 'entire_purchase',
        specific_category_id: '',
        specific_product_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        applies_to_all_locations: true,
        location_ids: [],
        tag_ids: [],
        max_uses: null,
        is_active: true,
        image_url: '',
        coupon_type: 'redeem_at_store'
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    console.log(formData, 'this is formData')

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Load user's businesses
    useEffect(() => {
        async function loadInitialData() {
            setIsLoading(true);
            try {
                // Get businesses owned by the user
                const businessesResult = await getUserBusinesses();
                if (businessesResult.businesses) {
                    setBusinesses(businessesResult.businesses);

                    // If editing, set business_id from coupon
                    // If creating and user has businesses, select first one by default
                    if (isEditing && coupon) {
                        setFormData(prev => ({
                            ...prev,
                            ...coupon,
                            start_date: new Date(coupon.start_date).toISOString().split('T')[0],
                            end_date: new Date(coupon.end_date).toISOString().split('T')[0],
                            max_uses: coupon.max_claims || 0
                        }));

                        // Set preview image if coupon has an image
                        if (coupon.image_url) {
                            setPreviewUrl(coupon.image_url);
                        }

                        // Load related data for editing
                        loadBusinessData(coupon.business_id);
                    } else if (businessesResult.businesses.length > 0) {
                        // Select first business by default for new coupons
                        const defaultBusinessId = businessesResult.businesses[0].id;
                        setFormData(prev => ({
                            ...prev,
                            business_id: defaultBusinessId
                        }));

                        // Load related data for new coupon with default business
                        loadBusinessData(defaultBusinessId);
                    }
                }

                // Load global tags
                const tagsResult = await getCouponTags();
                if (tagsResult.tags) {
                    setTags(tagsResult.tags);
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadInitialData();
    }, [isEditing, coupon]);

    // Load business-specific data when business_id changes
    async function loadBusinessData(businessId) {
        if (!businessId) return;

        try {
            // Get locations
            const locationsResult = await getBusinessLocations(businessId);
            if (locationsResult.locations) {
                setBusinessLocations(locationsResult.locations);
            }

            // Get categories
            const categoriesResult = await getBusinessCategories(businessId);
            if (categoriesResult.categories) {
                setCategories(categoriesResult.categories);
            }

            // Get products
            const productsResult = await getBusinessProducts(businessId);
            if (productsResult.products) {
                setProducts(productsResult.products);
            }
        } catch (error) {
            console.error('Error loading business data:', error);
        }
    }

    // When business changes, reload related data
    useEffect(() => {
        if (formData.business_id) {
            loadBusinessData(formData.business_id);
        }
    }, [formData.business_id]);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size should be less than 5MB');
            return;
        }

        setSelectedImage(file);
        setUploadError('');

        // Create preview URL
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    };

    const uploadImageToCloudinary = async (file) => {
        setIsUploading(true);
        try {
            // Create a FormData object
            const formData = new FormData();
            formData.append('file', file);

            // Use server action for upload
            const result = await uploadImage(formData);

            if (result.error) {
                throw new Error(result.error);
            }

            return result.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploadError('Failed to upload image. Please try again.');
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    // Get a random default image URL
    const getRandomDefaultImage = () => {
        const randomIndex = Math.floor(Math.random() * DEFAULT_COUPON_IMAGES.length);
        return DEFAULT_COUPON_IMAGES[randomIndex];
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleCheckboxChange2 = (e, field, tagId) => {
        const checked = e.target.checked;

        setFormData((prevData) => {
            const currentValues = prevData[field] || [];
            if (checked) {
                return {
                    ...prevData,
                    [field]: [...currentValues, tagId],
                };
            } else {
                return {
                    ...prevData,
                    [field]: currentValues.filter((v) => v !== tagId),
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (!validateForm()) {
        //     return;
        // }

        setIsSubmitting(true);

        try {
            // Handle image upload or default image selection
            let imageUrl = formData.image_url;

            if (selectedImage) {
                // Upload selected image to Cloudinary
                imageUrl = await uploadImageToCloudinary(selectedImage);
            } else if (!imageUrl) {
                // If no image was selected and no existing image, use a random default
                imageUrl = getRandomDefaultImage();
            }

            // Update form data with image URL
            const updatedFormData = {
                ...formData,
                image_url: imageUrl
            };

            // Save coupon with image URL
            let result;
            if (isEditing && coupon?.id) {
                result = await updateCoupon(coupon.id, updatedFormData);
            } else {
                result = await createCoupon(updatedFormData);
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

        if (!formData.business_id) {
            newErrors.business_id = 'Please select a business';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Coupon code is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Coupon title is required';
        }

        if (formData.discount_value <= 0 && ['percentage', 'fixed_amount'].includes(formData.discount_type)) {
            newErrors.discount_value = 'Discount value must be greater than 0';
        }

        if (formData.discount_type === 'percentage' && formData.discount_value > 100) {
            newErrors.discount_value = 'Percentage discount cannot exceed 100%';
        }

        if (formData.applies_to === 'specific_category' && !formData.specific_category_id) {
            newErrors.specific_category_id = 'Category is required';
        }

        if (formData.applies_to === 'specific_product' && !formData.specific_product_id) {
            newErrors.specific_product_id = 'Product is required';
        }

        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }

        if (!formData.end_date) {
            newErrors.end_date = 'End date is required';
        } else if (new Date(formData.end_date) <= new Date(formData.start_date)) {
            newErrors.end_date = 'End date must be after start date';
        }

        if (!formData.applies_to_all_locations && (!formData.location_ids || formData.location_ids.length === 0)) {
            newErrors.location_ids = 'At least one location must be selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateRandomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData((prev) => ({
            ...prev,
            code: result,
        }));
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl('');
        setFormData(prev => ({
            ...prev,
            image_url: ''
        }));

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="text-blue-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black mb-4 border-b-4 border-black pb-2">
                {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Business Selection */}
                <div className="space-y-1">
                    <label className="block font-bold text-base sm:text-lg">Business</label>
                    <select
                        name="business_id"
                        value={formData.business_id}
                        onChange={handleChange}
                        className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                        required
                    >
                        <option value="">Select a business</option>
                        {businesses.map((business) => (
                            <option key={business.id} value={business.id}>
                                {business.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Coupon Code */}
                <div className="space-y-1">
                    <label className="block font-bold text-base sm:text-lg">Coupon Code</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="flex-1 p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                            required
                        />
                        <button
                            type="button"
                            onClick={generateRandomCode}
                            className="px-3 py-2 bg-blue-100 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-sm sm:text-base whitespace-nowrap"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                    <label className="block font-bold text-base sm:text-lg">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                        required
                    />
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="block font-bold text-base sm:text-lg">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 min-h-[80px] text-sm sm:text-base"
                        required
                    />
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block font-bold text-base sm:text-lg">Discount Type</label>
                        <select
                            name="discount_type"
                            value={formData.discount_type}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block font-bold text-base sm:text-lg">Discount Value</label>
                        <input
                            type="number"
                            name="discount_value"
                            value={formData.discount_value}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                            required
                            min="0"
                        />
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="block font-bold text-base sm:text-lg">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block font-bold text-base sm:text-lg">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full p-2 sm:p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-sm sm:text-base"
                            required
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-1">
                    <label className="block font-bold text-base sm:text-lg">Coupon Image</label>
                    <div className="border-2 border-black p-2 sm:p-4">
                        {previewUrl ? (
                            <div className="relative">
                                <Image
                                    src={previewUrl}
                                    alt="Coupon preview"
                                    width={300}
                                    height={200}
                                    className="object-cover border-2 border-black w-full"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center p-3 border-2 border-dashed border-black">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-2 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-sm sm:text-base"
                                >
                                    Upload Image
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 sm:px-6 sm:py-3 bg-green-200 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update Coupon' : 'Create Coupon'}
                    </button>
                </div>
            </form>
        </div>
    );
}