// app/vendors/onboard/components/FormProgress.jsx
import { motion } from 'framer-motion';

export default function FormProgress({ currentStep }) {
    const steps = [
        { id: 1, name: 'Business Info' },
        { id: 2, name: 'Address' }
    ];

    return (
        <motion.div
            className="px-6 py-4 border-b border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className="flex items-center relative">
                            <motion.div
                                className={`rounded-full flex items-center justify-center w-8 h-8 ${currentStep >= step.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                                animate={{
                                    backgroundColor: currentStep >= step.id ? '#2563eb' : '#e5e7eb',
                                    color: currentStep >= step.id ? '#ffffff' : '#4b5563',
                                    scale: [1, currentStep === step.id ? 1.2 : 1, 1],
                                }}
                                transition={{ duration: 0.4 }}
                            >
                                {currentStep > step.id ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    step.id
                                )}
                            </motion.div>
                            <span className={`ml-2 text-sm ${currentStep >= step.id ? 'font-medium text-blue-600' : 'text-gray-500'
                                }`}>
                                {step.name}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className="flex-grow mx-4">
                                <div className="h-0.5 relative">
                                    <div className="absolute inset-0 bg-gray-200"></div>
                                    <motion.div
                                        className="absolute inset-0 bg-blue-600"
                                        initial={{ width: "0%" }}
                                        animate={{ width: currentStep > 1 ? "100%" : "0%" }}
                                        transition={{ duration: 0.5 }}
                                    ></motion.div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
}