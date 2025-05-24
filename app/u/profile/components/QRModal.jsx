'use client';
import { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, CheckCircle, Sparkles } from 'lucide-react';

export default function QRModal({ isOpen, onClose, qrValue, couponTitle, showConfirmation = false }) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full relative overflow-hidden"
            >
                {/* Confirmation Animation Overlay */}
                {showConfirmation && (
                    <div className="absolute inset-0 bg-green-500 flex items-center justify-center z-50 animate-fadeIn">
                        <div className="text-center text-white">
                            <div className="relative">
                                <CheckCircle size={80} className="mx-auto mb-4 animate-bounce" />
                                {/* Sparkle effects */}
                                <Sparkles
                                    size={24}
                                    className="absolute -top-2 -right-2 animate-ping text-yellow-300"
                                />
                                <Sparkles
                                    size={18}
                                    className="absolute -bottom-1 -left-1 animate-ping text-yellow-300 animation-delay-300"
                                />
                                <Sparkles
                                    size={20}
                                    className="absolute top-8 -left-4 animate-ping text-yellow-300 animation-delay-600"
                                />
                            </div>
                            <h3 className="text-3xl font-black mb-2">SUCCESS!</h3>
                            <p className="text-xl font-bold">Coupon Scanned Successfully</p>
                            <div className="mt-4 animate-pulse">
                                <div className="bg-white text-green-500 px-4 py-2 border-4 border-white font-black text-lg">
                                    ENJOY YOUR DISCOUNT!
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Redeem Coupon</h2>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                        <QRCodeCanvas
                            value={qrValue}
                            size={250}
                            level="H"
                        />
                        {/* Scanning indicator */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="w-full h-0.5 bg-red-500 animate-scan-line opacity-70"></div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xl font-bold mb-2">{couponTitle}</p>
                        <p className="text-gray-600 mb-6">Show this QR code to the store staff</p>

                        {/* Status indicator */}
                        <div className="flex items-center justify-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-medium">Ready to scan</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes scanLine {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(250px);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }

                .animate-scan-line {
                    animation: scanLine 2s linear infinite;
                }

                .animation-delay-300 {
                    animation-delay: 0.3s;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
            `}</style>
        </div>
    );
}