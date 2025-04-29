// app/vendors/onboard/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import VendorInfoSection from './components/VendorInfoSection';
import AddressSection from './components/AddressSection';
import SubmitSection from './components/SubmitSection';
import FormProgress from './components/FormProgress';
import { insertVendorOnboardApplication } from './actions/onboardActions';

export default function VendorOnboardingPage() {

    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        country: ''
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
            // Here you would add your API call to save vendor data
            console.log('Submitting vendor data:', formData);

            const resp = await insertVendorOnboardApplication(formData)

            if (resp.success) {
                router.push('/vendor-onboard/success');
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
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto px-4 py-8 md:py-12"
        >
            <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="bg-blue-600 py-6 px-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Vendor Onboarding</h1>
                    <p className="text-blue-100 mt-2">Join the Coupon Stall platform and grow your business</p>
                </div>

                <FormProgress currentStep={currentStep} />

                <form onSubmit={handleSubmit} className="p-6">
                    {currentStep === 1 && (
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <VendorInfoSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            <AddressSection
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        </motion.div>
                    )}

                    <SubmitSection
                        currentStep={currentStep}
                        isSubmitting={isSubmitting}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        totalSteps={2}
                    />
                </form>
            </motion.div>
        </motion.div>
    );
}