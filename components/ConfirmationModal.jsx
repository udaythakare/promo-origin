import React from 'react';
import { X, QrCode, CheckCircle, AlertCircle } from 'lucide-react';

// Confirmation Modal Component
export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    coupon,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showCancel = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-60"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-sm sm:max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-yellow-400 border-b-4 border-black p-3 sm:p-4 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl font-black text-black uppercase tracking-wide leading-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 bg-red-500 border-2 border-black shadow-[3px_3px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        <X size={16} className="text-white font-bold" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {/* Message */}
                    <div className="mb-6">
                        <p className="text-base sm:text-lg font-bold text-black leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Coupon info if available */}
                    {coupon && (
                        <div className="mb-6 p-3 sm:p-4 bg-blue-100 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                            <h3 className="font-black text-base sm:text-lg text-black mb-2 uppercase leading-tight">
                                {coupon.title}
                            </h3>
                            {coupon.description && (
                                <p className="text-xs sm:text-sm font-bold text-gray-800 mb-2">
                                    {coupon.description}
                                </p>
                            )}
                            {coupon.discount && (
                                <div className="inline-block bg-green-400 px-2 py-1 border-2 border-black font-black text-black text-xs uppercase">
                                    {coupon.discount}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-green-400 hover:bg-green-500 text-black font-black py-3 px-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-wide text-sm"
                        >
                            {confirmText}
                        </button>

                        {showCancel && (
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-300 hover:bg-gray-400 text-black font-black py-3 px-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] uppercase tracking-wide text-sm"
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
