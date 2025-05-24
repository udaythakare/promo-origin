export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    couponType,
    redeemDuration,
    endDate
}) => {
    if (!isOpen) return null;

    const getModalContent = () => {
        if (couponType === 'redeem_at_store') {
            const minutes = redeemDuration === "5 minutes" ? 5 : 10;
            return {
                title: "CLAIM IN-STORE COUPON?",
                message: `Once claimed, you'll have ${minutes} minutes to use this coupon in-store. The timer starts immediately!`,
                warning: "⚠️ This coupon expires quickly!"
            };
        } else if (couponType === 'redeem_online') {
            const endDateObj = endDate ? new Date(endDate) : null;
            const formattedDate = endDateObj && !isNaN(endDateObj.getTime())
                ? endDateObj.toLocaleDateString()
                : null;

            return {
                title: "CLAIM ONLINE COUPON?",
                message: formattedDate
                    ? `This coupon can be used online anytime until ${formattedDate}.`
                    : "This coupon can be used online.",
                warning: null
            };
        }

        return {
            title: "CLAIM COUPON?",
            message: "Are you sure you want to claim this coupon?",
            warning: null
        };
    };

    const { title, message, warning } = getModalContent();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
            <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]">
                {/* Header */}
                <div className="bg-yellow-400 border-b-4 border-black p-4">
                    <h2 className="text-xl font-black text-black uppercase tracking-tight">
                        {title}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-black font-bold text-base leading-relaxed">
                        {message}
                    </p>

                    {warning && (
                        <div className="bg-red-100 border-3 border-red-500 p-3 shadow-[4px_4px_0px_0px_#ef4444]">
                            <p className="text-red-800 font-black text-sm uppercase">
                                {warning}
                            </p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="border-t-4 border-black p-4 space-y-3 sm:space-y-0 sm:flex sm:space-x-3">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-1/2 bg-gray-300 hover:bg-gray-400 text-black font-black py-3 px-6 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 uppercase tracking-wide"
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-1/2 bg-green-400 hover:bg-green-500 text-black font-black py-3 px-6 border-3 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 uppercase tracking-wide"
                    >
                        CLAIM NOW
                    </button>
                </div>
            </div>
        </div>
    );
};