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
        image_url: '', // Added for storing the image URL
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

        if (!validateForm()) {
            return;
        }

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

            router.push('/vendor/dashboard/coupons');
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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!validateForm()) {
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         let result;

    //         if (isEditing && coupon?.id) {
    //             result = await updateCoupon(coupon.id, formData);
    //         } else {
    //             result = await createCoupon(formData);
    //         }

    //         if (result.error) {
    //             setErrors({
    //                 form: result.error
    //             });
    //             return;
    //         }

    //         router.push('/vendor/dashboard/coupons');
    //         router.refresh();
    //     } catch (error) {
    //         console.error('Error submitting form:', error);
    //         setErrors({
    //             form: 'Failed to save coupon. Please try again.'
    //         });
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

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
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {errors.form}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-blue-800">Basic Information</h2>

                    {/* Business Selection (New) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business*
                        </label>
                        <select
                            name="business_id"
                            value={formData.business_id}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.business_id ? 'border-red-300' : ''}`}
                            disabled={isEditing} // Can't change business when editing
                        >
                            <option value="">Select Business</option>
                            {businesses.map((business) => (
                                <option key={business.id} value={business.id}>{business.name}</option>
                            ))}
                        </select>
                        {errors.business_id && <p className="mt-1 text-sm text-red-600">{errors.business_id}</p>}
                        {businesses.length === 0 && (
                            <p className="mt-1 text-sm text-amber-600">You don't have any businesses. Please create a business first.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Coupon Code*
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className={`block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.code ? 'border-red-300' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={generateRandomCode}
                                className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md hover:bg-gray-200"
                            >
                                Generate
                            </button>
                        </div>
                        {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title*
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.title ? 'border-red-300' : ''}`}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Active</span>
                        </div>
                    </div>
                </div>

                {/* Discount Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-blue-800">Discount Information</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Discount Type*
                        </label>
                        <select
                            name="discount_type"
                            value={formData.discount_type}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="percentage">Percentage Off</option>
                            <option value="fixed_amount">Fixed Amount Off</option>
                            <option value="buy_one_get_one">Buy One Get One Free</option>
                            <option value="free_item">Free Item</option>
                            <option value="other">Other</option>

                        </select>
                    </div>


                    {!['other'].includes(formData.discount_type) && (
                        <>
                            {['percentage', 'fixed_amount'].includes(formData.discount_type) && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {formData.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}*
                                    </label>
                                    <input
                                        type="number"
                                        name="discount_value"
                                        value={formData.discount_value}
                                        onChange={handleChange}
                                        min="0"
                                        step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                                        max={formData.discount_type === 'percentage' ? '100' : undefined}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.discount_value ? 'border-red-300' : ''}`}
                                    />
                                    {errors.discount_value && (
                                        <p className="mt-1 text-sm text-red-600">{errors.discount_value}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Minimum Purchase Amount ($)
                                </label>
                                <input
                                    type="number"
                                    name="minimum_purchase"
                                    value={formData.minimum_purchase}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Usage Limit
                        </label>
                        <input
                            type="number"
                            name="max_uses"
                            value={formData.max_uses || ''}
                            onChange={handleChange}
                            min="1"
                            placeholder="Leave blank for unlimited"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Settings */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-blue-800">Application Settings</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Applies To*
                        </label>
                        <select
                            name="applies_to"
                            value={formData.applies_to}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="entire_purchase">Entire Purchase</option>
                            <option value="specific_category">Specific Category</option>
                            <option value="specific_product">Specific Product</option>
                        </select>
                    </div>

                    {formData.applies_to === 'specific_category' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category*
                            </label>
                            <select
                                name="specific_category_id"
                                value={formData.specific_category_id || ''}
                                onChange={handleChange}
                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.specific_category_id ? 'border-red-300' : ''}`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            {errors.specific_category_id && <p className="mt-1 text-sm text-red-600">{errors.specific_category_id}</p>}
                            {categories.length === 0 && (
                                <p className="mt-1 text-sm text-amber-600">No categories found. Please create product categories first.</p>
                            )}
                        </div>
                    )}

                    {formData.applies_to === 'specific_product' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product*
                            </label>
                            <select
                                name="specific_product_id"
                                value={formData.specific_product_id || ''}
                                onChange={handleChange}
                                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.specific_product_id ? 'border-red-300' : ''}`}
                            >
                                <option value="">Select Product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                            {errors.specific_product_id && <p className="mt-1 text-sm text-red-600">{errors.specific_product_id}</p>}
                            {products.length === 0 && (
                                <p className="mt-1 text-sm text-amber-600">No products found. Please add products first.</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location Availability
                        </label>
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                name="applies_to_all_locations"
                                checked={formData.applies_to_all_locations}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Valid at all locations</span>
                        </div>

                        {!formData.applies_to_all_locations && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
                                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                                    {businessLocations.length > 0 ? (
                                        businessLocations.map((location) => (
                                            <label key={location.id} className="inline-flex items-center space-x-2 text-sm text-gray-700">
                                                <input
                                                    type="checkbox"
                                                    value={location.id}
                                                    checked={formData.location_ids?.includes(location.id)}
                                                    onChange={(e) => handleCheckboxChange2(e, 'location_ids', location.id)}
                                                    className="form-checkbox text-blue-600"
                                                />
                                                <span>{location.address}, {location.city}</span>
                                            </label>
                                        ))
                                    ) : (
                                        <p className="text-sm text-amber-600">No locations found. Please add business locations first.</p>
                                    )}
                                </div>
                                {errors.location_ids && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location_ids}</p>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                {/* Validity Period & Tags */}
                <div className="space-y-4">
                    <h2 className="text-lg font-medium text-blue-800">Validity Period</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date*
                        </label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.start_date ? 'border-red-300' : ''}`}
                        />
                        {errors.start_date && <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date*
                        </label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.end_date ? 'border-red-300' : ''}`}
                        />
                        {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                            {tags.length > 0 ? (
                                tags.map((tag) => (
                                    <label key={tag.id} className="inline-flex items-center space-x-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            value={tag.id}
                                            checked={formData.tag_ids?.includes(tag.id)}
                                            onChange={(e) => handleCheckboxChange2(e, 'tag_ids', tag.id)}
                                            className="form-checkbox text-blue-600"
                                        />
                                        <span>{tag.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-amber-600">No tags available.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>


            {/* Image Upload Section */}
            <div className="border p-4 rounded-md">
                <h3 className="text-lg font-medium mb-2">Coupon Image</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Upload an image for your coupon. If you don't upload an image, a default one will be used.
                </p>

                {/* Preview Image */}
                {previewUrl && (
                    <div className="mb-4">
                        <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                                src={previewUrl}
                                alt="Coupon preview"
                                layout="fill"
                                objectFit="contain"
                                className="rounded-md"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={removeImage}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Remove Image
                        </button>
                    </div>
                )}

                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="mb-1 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.push('/coupons')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || businesses.length === 0}
                    className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting || businesses.length === 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Coupon' : 'Create Coupon'}
                </button>
            </div>
        </form >
    );
}