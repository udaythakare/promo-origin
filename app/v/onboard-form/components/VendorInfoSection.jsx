// app/vendors/onboard/components/VendorInfoSection.jsx
import { motion } from 'framer-motion';
import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
export default function VendorInfoSection({ formData, handleInputChange }) {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        async function fetchAreasAndCategories() {
            try {
                // Fetch categories
                const { data: categoryData, error: categoryError } = await supabase
                    .from("business_categories")
                    .select("id, name");

                if (categoryError) throw categoryError;
                setCategories(categoryData || []);

                // Fetch areas - assuming you have an areas table
                // If you don't have one, you could use city/state data from your businesses table
                // const { data: areaData, error: areaError } = await supabase
                //   .from("areas") // Replace with your actual table name
                //   .select("id, name");

                // if (areaError) throw areaError;
                // setAreas(areaData || []);
            } catch (err) {
                console.error("Error fetching initial data:", err);
            }
        }

        fetchAreasAndCategories();
    }, []);
    const inputVariants = {
        focus: { scale: 1.02, borderColor: '#2563eb', transition: { duration: 0.2 } },
        blur: { scale: 1, borderColor: '#e5e7eb', transition: { duration: 0.2 } }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Business Information</h2>
                <p className="text-gray-600 mb-6">Tell us about your business so we can customize your experience</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                        variants={inputVariants}
                        initial="blur"
                        whileFocus="focus"
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your business name"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Description
                    </label>
                    <motion.textarea
                        variants={inputVariants}
                        initial="blur"
                        whileFocus="focus"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your business in a few sentences"
                    />
                </div>

                <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Business Category <span className="text-red-500">*</span>
                    </label>
                    <motion.select
                        variants={inputVariants}
                        initial="blur"
                        whileFocus="focus"
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </motion.select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Business Email <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            variants={inputVariants}
                            initial="blur"
                            whileFocus="focus"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            variants={inputVariants}
                            initial="blur"
                            whileFocus="focus"
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="(123) 456-7890"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website URL
                    </label>
                    <motion.input
                        variants={inputVariants}
                        initial="blur"
                        whileFocus="focus"
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                    />
                </div>
            </div>
        </div>
    );
}