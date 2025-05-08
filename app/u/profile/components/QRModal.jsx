// components/QRModal.js
'use client';
import { useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';

export default function QRModal({ isOpen, onClose, qrValue, couponTitle }) {
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
                className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-w-md w-full"
            >
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
                    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <QRCodeCanvas
                            value={qrValue}
                            size={250}
                            level="H"
                        />
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xl font-bold mb-2">{couponTitle}</p>
                        <p className="text-gray-600 mb-6">Show this QR code to the store staff</p>

                        <button
                            onClick={() => {
                                const canvas = document.querySelector('canvas');
                                const url = canvas.toDataURL('image/png');
                                const link = document.createElement('a');
                                link.download = 'coupon-qrcode.png';
                                link.href = url;
                                link.click();
                            }}
                            className="px-6 py-3 bg-blue-100 border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold text-sm sm:text-base"
                        >
                            Download QR Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}