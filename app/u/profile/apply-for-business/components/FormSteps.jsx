// app/u/profile/apply-for-business/components/FormSteps.jsx
'use client';

import { motion } from 'framer-motion';

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function FormSteps({ currentStep, formData, handleInputChange, dropdownData }) {
    const { categories, areaData, cityData, stateData } = dropdownData;

    return (
        <>
            {currentStep === 1 && (
                <motion.div
                    key="step1"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-white p-6 mb-6 rounded border-4 border-black"
                >
                    <h2 className="text-2xl font-black uppercase mb-6 inline-block bg-black text-white px-4 py-2 transform -skew-x-6">VENDOR INFO</h2>
                    <VendorInfo
                        formData={formData}
                        handleInputChange={handleInputChange}
                        categories={categories}
                    />
                </motion.div>
            )}

            {currentStep === 2 && (
                <motion.div
                    key="step2"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="bg-white p-6 mb-6 rounded border-4 border-black"
                >
                    <h2 className="text-2xl font-black uppercase mb-6 inline-block bg-black text-white px-4 py-2 transform -skew-x-6">ADDRESS INFO</h2>
                    <AddressInfo
                        formData={formData}
                        handleInputChange={handleInputChange}
                        areaData={areaData}
                        cityData={cityData}
                        stateData={stateData}
                    />
                </motion.div>
            )}
        </>
    );
}

// Vendor Information Form Fields
function VendorInfo({ formData, handleInputChange, categories }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-lg font-bold">Business Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
                    minLength="2"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-lg font-bold">Business Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    rows="4"
                    placeholder="Tell us about your business..."
                ></textarea>
            </div>

            <div className="space-y-2">
                <label className="block text-lg font-bold">Business Category *</label>
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-lg font-bold">Website</label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        placeholder="https://example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-lg font-bold">Phone Number *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                        minLength="10"
                        placeholder="10-digit phone number"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-lg font-bold">Email Address *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
                    placeholder="business@example.com"
                />
            </div>
        </div>
    );
}

// Address Information Form Fields
function AddressInfo({ formData, handleInputChange, areaData, cityData, stateData }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-lg font-bold">Address *</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
                    minLength="5"
                    placeholder="Street address, building number"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-lg font-bold">Area *</label>
                    <select
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                    >
                        <option value="">Select Area</option>
                        {areaData.map(area => (
                            <option key={area.id} value={area.name}>{area.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-lg font-bold">City *</label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                    >
                        <option value="">Select City</option>
                        {cityData.map(city => (
                            <option key={city.id} value={city.name}>{city.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-lg font-bold">State *</label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                    >
                        <option value="">Select State</option>
                        {stateData.map(state => (
                            <option key={state.id} value={state.name}>{state.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-lg font-bold">Postal Code *</label>
                    <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                        minLength="4"
                        placeholder="Postal/ZIP code"
                    />
                </div>
            </div>
        </div>
    );
}