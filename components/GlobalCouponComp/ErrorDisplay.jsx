import React from 'react';
import { X } from 'lucide-react';

export const ErrorDisplay = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 text-red-700 font-bold">
            <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                    onClick={onClose}
                    className="ml-2 text-red-500 hover:text-red-700"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};