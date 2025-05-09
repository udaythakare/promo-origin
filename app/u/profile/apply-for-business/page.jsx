// app/vendors/onboard/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCategories, insertVendorOnboardApplication } from './actions/onboardActions';
import { getAddressDropdowns } from '@/actions/addressActions';

export default function VendorOnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [areaData, setAreaData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchDropDownData = async () => {
            const response = await getAddressDropdowns();
            if (response.success) {
                setAreaData(response.areaData || []);
                setCityData(response.cityData || []);
                setStateData(response.stateData || []);
            } else {
                alert(response.message);
            }
        }

        const fetchCategories = async () => {
            const response = await getCategories();
            console.log(response, 'this is categor')
            if (response.success) {
                setCategories(response.data || []);
            }
        }
        fetchCategories();
        fetchDropDownData();
    }, [])

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
        country: '',
        area: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const resp = await insertVendorOnboardApplication(formData)

            if (resp.success) {
                alert("Vendor application submitted successfully!");
                router.push('/');
                return;
            }

            alert(resp.message)
        } catch (error) {
            console.error('Error submitting vendor form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    // Neo-brutalist color themes
    const colors = {
        main: 'bg-yellow-300',
        accent: 'bg-black',
        text: 'text-black',
        border: 'border-black border-4'
    };

    return (
        <div className=" min-h-screen py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >


                {/* Main Form Container */}
                <motion.div
                    className={`${colors.main} rounded-md ${colors.border} shadow-[8px_8px_0px_0px_rgba(0,0,0)] overflow-hidden`}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Form Header */}
                    <div className="bg-black py-6 px-6">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="absolute -left-3 -top-3 bg-white h-6 w-6 transform rotate-45"></div>
                                <h1 className="text-3xl font-black uppercase text-white relative z-10 pl-4">VENDOR ONBOARDING</h1>
                            </div>
                        </div>
                        <p className="text-white mt-2 font-bold">Join the Coupon Stall platform and grow your business</p>
                    </div>

                    {/* Custom Progress Indicator */}
                    <div className="flex justify-center py-4">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 flex items-center justify-center ${currentStep >= 1 ? 'bg-black text-white' : 'bg-white text-black'} ${colors.border} font-black`}>1</div>
                            <div className="w-16 h-2 bg-black"></div>
                            <div className={`h-10 w-10 flex items-center justify-center ${currentStep >= 2 ? 'bg-black text-white' : 'bg-white text-black'} ${colors.border} font-black`}>2</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {currentStep === 1 && (
                            <motion.div
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="bg-white p-6 mb-6 rounded ${colors.border}"
                            >
                                <h2 className="text-2xl font-black uppercase mb-6 inline-block bg-black text-white px-4 py-2 transform -skew-x-6">VENDOR INFO</h2>
                                <VendorInfoNeoBrutalist
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    categories={categories}
                                />
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="bg-white p-6 mb-6 rounded ${colors.border}"
                            >
                                <h2 className="text-2xl font-black uppercase mb-6 inline-block bg-black text-white px-4 py-2 transform -skew-x-6">ADDRESS INFO</h2>
                                <AddressNeoBrutalist
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    areaData={areaData}
                                    cityData={cityData}
                                    stateData={stateData}
                                />
                            </motion.div>
                        )}

                        <SubmitNeoBrutalist
                            currentStep={currentStep}
                            isSubmitting={isSubmitting}
                            prevStep={prevStep}
                            nextStep={nextStep}
                            totalSteps={2}
                        />
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
}

// Neo-brutalist styled components
function VendorInfoNeoBrutalist({ formData, handleInputChange, categories }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-lg font-bold">Business Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
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
                    required
                ></textarea>
            </div>

            <div className="space-y-2">
                <label className="block text-lg font-bold">Business Category</label>
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
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-lg font-bold">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-lg font-bold">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
                />
            </div>
        </div>
    );
}

function AddressNeoBrutalist({ formData, handleInputChange, areaData, cityData, stateData }) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="block text-lg font-bold">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-lg font-bold">Area</label>
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
                    <label className="block text-lg font-bold">City</label>
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

                <div className="space-y-2">
                    <label className="block text-lg font-bold">State</label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-lg font-bold">Postal Code</label>
                    <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full p-3 border-4 border-black bg-white focus:ring-0 focus:outline-none focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                        required
                    />
                </div>


            </div>
        </div>
    );
}

function SubmitNeoBrutalist({ currentStep, isSubmitting, prevStep, nextStep, totalSteps }) {
    const commonButtonClasses = "px-8 py-3 font-bold uppercase border-4 border-black transform transition hover:-translate-y-1";

    return (
        <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
                <button
                    type="button"
                    onClick={prevStep}
                    className={`${commonButtonClasses} bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]`}
                    disabled={isSubmitting}
                >
                    Back
                </button>
            ) : (
                <div></div>
            )}

            {currentStep < totalSteps ? (
                <button
                    type="button"
                    onClick={nextStep}
                    className={`${commonButtonClasses} bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]`}
                    disabled={isSubmitting}
                >
                    Next Step
                </button>
            ) : (
                <button
                    type="submit"
                    className={`${commonButtonClasses} bg-green-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            )}
        </div>
    );
}