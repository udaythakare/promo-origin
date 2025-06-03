'use client';
import { useState } from 'react';
import QRScanner from './components/QRScanner';
import { getCouponById } from '../coupons/actions/couponActions';
import { getCouponStatus, getUserData } from '@/helpers/userHelper';
import { acceptCoupon } from './actions/requestCouponAction';

export default function ScanPage() {
    const [scanHistory, setScanHistory] = useState([]);
    const [couponData, setCouponData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCouponCard, setShowCouponCard] = useState(false);
    const [isRedeemed, setIsRedeemed] = useState(false);
    const [validUntilDate, setValidUntilDate] = useState(null);

    const handleQRDetected = async (value) => {
        try {
            setLoading(true);

            // Add the scanned QR to history
            setScanHistory(prev => [
                { value, timestamp: new Date().toLocaleString() },
                ...prev
            ]);

            // Parse the QR code data
            console.log(value,'this is value')
            const data = JSON.parse(value);
            const couponId = data.couponId;
            const userId = data.userId;

            // Fetch coupon and user data
            const fetchedCouponData = await getCouponById(couponId);
            const fetchedUserData = await getUserData(userId);
            const fetchCouponStatus = await getCouponStatus(couponId, userId);

            // Set remaining claim time as valid until date
            setValidUntilDate(fetchCouponStatus.couponStatus.remaining_claim_time);

            setIsRedeemed(fetchCouponStatus.couponStatus.coupon_status === "redeemed");

            setCouponData(fetchedCouponData);
            setUserData(fetchedUserData.user);
            setShowCouponCard(true);
        } catch (error) {
            console.error("Error processing QR code:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        const response = await acceptCoupon(couponData.id, userData.id);
        if (!response.success) {
            alert("Error accepting coupon: " + response.error);
            return;
        }
        alert("Coupon accepted successfully!");
        setShowCouponCard(false);
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-pink-200">
            <h1 className="text-4xl font-black mt-6 mb-10 text-black tracking-tight transform -rotate-1">QR CODE SCANNER</h1>

            <QRScanner onDetected={handleQRDetected} />

            {loading && (
                <div className="mt-8 flex items-center justify-center">
                    <div className="animate-spin rounded-none h-16 w-16 border-4 border-black"></div>
                </div>
            )}

            {showCouponCard && couponData && userData && (
                <div className="mt-8 w-full max-w-md bg-cyan-300 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transform rotate-1">
                    <div className="p-6">
                        <h2 className="text-3xl font-black text-black transform -rotate-1">{couponData.title}</h2>
                        <p className="text-black font-bold mt-2">{couponData.description}</p>

                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between font-bold">
                                <span className="text-black">Valid Until:</span>
                                <span className="font-black bg-white px-2 py-1 border-2 border-black transform rotate-1">
                                    {validUntilDate ? new Date(validUntilDate).toLocaleString() : 'Processing...'}
                                </span>
                            </div>

                            <div className="flex justify-between font-bold">
                                <span className="text-black">Coupon Type:</span>
                                <span className="font-black bg-white px-2 py-1 border-2 border-black transform -rotate-1 capitalize">
                                    {couponData.coupon_type.replace(/_/g, ' ')}
                                </span>
                            </div>

                            {isRedeemed && (
                                <div className="flex justify-between font-bold">
                                    <span className="text-black">Status:</span>
                                    <span className="font-black bg-red-400 px-2 py-1 border-2 border-black transform -rotate-2">
                                        Already Redeemed
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t-4 border-black">
                            <h3 className="font-black text-xl text-black">User Details</h3>
                            <p className="text-black font-bold mt-2">{userData.full_name}</p>
                            <p className="text-black font-bold">{userData.email}</p>
                        </div>

                        {!isRedeemed ? (
                            <button
                                onClick={handleAccept}
                                className="mt-6 w-full bg-green-400 hover:bg-green-500 text-black font-black py-4 px-6 rounded-none border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-xl uppercase"
                            >
                                Accept Coupon
                            </button>
                        ) : (
                            <div className="mt-6 w-full bg-gray-400 text-black font-black py-4 px-6 rounded-none border-4 border-black flex justify-center items-center text-xl uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Coupon Already Redeemed
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-12 text-center">
                <p className="text-black font-bold text-lg transform rotate-1">This scanner works on both desktop and mobile devices.</p>
                <p className="text-black font-bold text-lg transform -rotate-1">Allow camera permissions when prompted to scan QR codes.</p>
            </div>
        </main>
    );
}