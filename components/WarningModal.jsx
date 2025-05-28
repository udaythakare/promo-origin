import React from 'react';

const WarningModal = ({ isVisible, onCancel, onContinue }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-yellow-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full">
                <h3 className="text-xl font-black mb-4">⚠️ Important Warning</h3>
                <p className="mb-6 font-medium">
                    Once this coupon is claimed by any user, you will <span className="font-bold underline">NOT</span> be able to edit or delete it.
                    You can only edit or delete coupons that have not been claimed yet.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={onContinue}
                        className="px-4 py-2 bg-green-200 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold"
                    >
                        I Understand, Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarningModal;