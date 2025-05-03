// components/QRModal.js
'use client';
import { useEffect, useRef } from 'react';
// import QRCode from 'qrcode.react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRModal({ isOpen, onClose, qrValue }) {
    const modalRef = useRef(null);
    console.log(qrValue, "qrValue in modal")

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-700">Your QR Code</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-blue-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                        {/* <QRCode
                            value={qrValue || 'https://nextjs.org'}
                            size={250}
                            level="H"
                            fgColor="#1d4ed8" // Blue foreground
                            bgColor="#ffffff" // White background
                            className="mx-auto"
                        /> */}
                        <QRCodeCanvas
                            value={qrValue || 'https://nextjs.org'}
                            size={250}
                            level="H"
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600 mb-4">QR code for: {qrValue}</p>
                        <button
                            onClick={() => {
                                const canvas = document.querySelector('canvas');
                                const url = canvas.toDataURL('image/png');
                                const link = document.createElement('a');
                                link.download = 'qrcode.png';
                                link.href = url;
                                link.click();
                            }}
                            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors w-full md:w-auto"
                        >
                            Download QR Code
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}