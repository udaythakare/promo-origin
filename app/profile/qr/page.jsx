// app/page.js
'use client';
import { useState } from 'react';
import QRModal from './components/QRModal';
import QRForm from './components/QRForm';

export default function Home() {
    const [qrValue, setQrValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGenerateQR = (value) => {
        setQrValue(value);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-blue-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">QR Code Generator</h1>
                <QRForm onGenerateQR={handleGenerateQR} />
            </div>

            {isModalOpen && (
                <QRModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    qrValue={qrValue}
                />
            )}
        </main>
    );
}