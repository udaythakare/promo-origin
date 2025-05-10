// app/vendors/onboard/components/AddressSection.jsx
import { motion } from 'framer-motion';

export default function AddressSection({ formData, handleInputChange, areaData, cityData, stateData }) {
    // console.log(og(areaData, cityData, stateData, "AddressSection Dropdown Data");

    const inputVariants = {
        focus: { scale: 1.02, borderColor: '#2563eb', transition: { duration: 0.2 } },
        blur: { scale: 1, borderColor: '#e5e7eb', transition: { duration: 0.2 } }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Business Address</h2>
                <p className="text-gray-600 mb-6">Provide your business location information</p>
            </div>

            <motion.div
                className="p-6 rounded-lg border border-gray-200 bg-blue-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <div className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address <span className="text-red-500">*</span>
                        </label>
                        <motion.input
                            variants={inputVariants}
                            initial="blur"
                            whileFocus="focus"
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123 Main Street"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                                Area <span className="text-red-500">*</span>
                            </label>
                            <motion.select
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                id="area"
                                name="area"
                                value={formData.area || ''}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select an area</option>
                                {areaData && areaData.map((area) => (
                                    <option key={area.id} value={area.name}>
                                        {area.name}
                                    </option>
                                ))}
                            </motion.select>
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <motion.select
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                id="city"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a city</option>
                                {cityData && cityData.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </motion.select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                State/Province <span className="text-red-500">*</span>
                            </label>
                            <motion.select
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                id="state"
                                name="state"
                                value={formData.state || ''}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a state</option>
                                {stateData && stateData.map((state) => (
                                    <option key={state.id} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </motion.select>
                        </div>

                        <div>
                            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <motion.input
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                type="text"
                                id="postal_code"
                                name="postal_code"
                                value={formData.postal_code}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="12345"
                                required
                            />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}