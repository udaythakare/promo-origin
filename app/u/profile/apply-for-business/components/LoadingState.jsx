// app/u/profile/apply-for-business/components/LoadingState.jsx
'use client';

import { motion } from 'framer-motion';

export default function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
            >
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-black"></div>
                <p className="mt-4 text-lg font-bold">Loading form data...</p>
            </motion.div>
        </div>
    );
} 