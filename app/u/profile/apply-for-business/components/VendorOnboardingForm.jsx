// app/u/profile/apply-for-business/components/VendorOnboardingForm.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FormSteps from './FormSteps';

export default function VendorOnboardingForm({ initialFormData, dropdownData, onSubmit }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateStep = (step) => {
        if (step === 1) {
            const requiredFields = ['name', 'category_id', 'phone', 'email'];
            const missingFields = requiredFields.filter(field => !formData[field]?.trim());

            if (missingFields.length > 0) {
                alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return false;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address');
                return false;
            }

            // Basic phone validation
            if (formData.phone.length < 10) {
                alert('Phone number must be at least 10 digits');
                return false;
            }
        }

        if (step === 2) {
            const requiredFields = ['address', 'city', 'state', 'postal_code', 'area'];
            const missingFields = requiredFields.filter(field => !formData[field]?.trim());

            if (missingFields.length > 0) {
                alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(2)) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(formData);
        } catch (error) {
            alert(error.message || 'Network error occurred. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Neo-brutalist color themes
    const colors = {
        main: 'bg-yellow-300',
        accent: 'bg-black',
        text: 'text-black',
        border: 'border-black border-4'
    };

    return (
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
                <FormSteps
                    currentStep={currentStep}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    dropdownData={dropdownData}
                />

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-8 py-3 font-bold uppercase border-4 border-black transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                            disabled={isSubmitting}
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {currentStep < 2 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-8 py-3 font-bold uppercase border-4 border-black transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                            disabled={isSubmitting}
                        >
                            Next Step
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-8 py-3 font-bold uppercase border-4 border-black transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    )}
                </div>
            </form>
        </motion.div>
    );
}