'use client';
import { useState, useEffect } from 'react';
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

    const handleQRDetected = async (value) => {
        try {
            setLoading(true);
            console.log(value, "value in scan page");

            // Add the scanned QR to history
            setScanHistory(prev => [
                { value, timestamp: new Date().toLocaleString() },
                ...prev
            ]);

            // Parse the QR code data
            const data = JSON.parse(value);
            const couponId = data.couponId;
            const userId = data.userId;

            // Fetch coupon and user data
            const fetchedCouponData = await getCouponById(couponId);
            const fetchedUserData = await getUserData(userId);
            const fetchCouponStatus = await getCouponStatus(couponId, userId);
            console.log(fetchCouponStatus, "fetch coupon status in scan page");

            setIsRedeemed(fetchCouponStatus.couponStatus.coupon_status === "redeemed");

            console.log(fetchedCouponData, "coupon data in scan page");
            console.log(fetchedUserData, "user data in scan page");



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
        console.log("Coupon accepted:", couponData?.id);
        // Add your logic for accepting the coupon here
        const response = await acceptCoupon(couponData.id, userData.id);
        if (!response.success) {
            console.error("Error accepting coupon:", response.error);
            alert("Error accepting coupon. Please try again.");
            return
        }
        alert("Coupon accepted successfully!");
        setShowCouponCard(false);
    };


    return (
        <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
            <h1 className="text-3xl font-bold mt-4 mb-8">QR Code Scanner</h1>

            <QRScanner onDetected={handleQRDetected} />

            {loading && (
                <div className="mt-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {showCouponCard && couponData && userData && (
                <div className="mt-6 w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="relative w-full h-48 bg-gray-300">
                        {couponData.image_url && (
                            <img
                                src={couponData.image_url}
                                alt={couponData.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/api/placeholder/400/200";
                                }}
                            />
                        )}
                    </div>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800">{couponData.title}</h2>
                        <p className="text-gray-600 mt-1">{couponData.description}</p>

                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Valid Until:</span>
                                <span className="font-medium">
                                    {new Date(couponData.end_date).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Coupon Type:</span>
                                <span className="font-medium capitalize">
                                    {couponData.coupon_type.replace(/_/g, ' ')}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Available Claims:</span>
                                <span className="font-medium">
                                    {couponData.max_claims - couponData.current_claims} of {couponData.max_claims}
                                </span>
                            </div>

                            {isRedeemed && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status:</span>
                                    <span className="font-medium text-red-500">
                                        Already Redeemed
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h3 className="font-semibold text-gray-700">User Details</h3>
                            <p className="text-gray-600">{userData.full_name}</p>
                            <p className="text-gray-500 text-sm">{userData.email}</p>
                        </div>

                        {!isRedeemed ? (
                            <button
                                onClick={handleAccept}
                                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                            >
                                Accept
                            </button>
                        ) : (
                            <div className="mt-6 w-full bg-gray-400 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Coupon Already Redeemed
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8 text-center text-gray-600">
                <p>This scanner works on both desktop and mobile devices.</p>
                <p>Allow camera permissions when prompted to scan QR codes.</p>
            </div>
        </main>
    );
}