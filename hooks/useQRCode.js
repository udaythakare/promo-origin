import { useState } from 'react';
import { getUserId } from '@/helpers/userHelper';

export const useQRCode = () => {
    const [isQROpen, setIsQROpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [qrData, setQrData] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const showQrCode = async (coupon) => {
        try {
            const userId = await getUserId();
            if (!userId) {
                throw new Error('Unable to get user ID');
            }
            const data = JSON.stringify({ userId, couponId: coupon.id });
            setQrData(data);
            setSelectedCoupon(coupon);
            setIsQROpen(true);
        } catch (error) {
            console.error('Error preparing QR code:', error);
            const errorMessage = 'Unable to generate QR code. Please try again.';
            alert(errorMessage);
        }
    };

    const closeQRModal = () => {
        setIsQROpen(false);
        setSelectedCoupon(null);
        setQrData('');
        setShowConfirmation(false);
    };

    return {
        isQROpen,
        selectedCoupon,
        qrData,
        showConfirmation,
        setShowConfirmation,
        showQrCode,
        closeQRModal
    };
};