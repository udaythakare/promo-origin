// components/QRForm.js
'use client';
import { useState } from 'react';

export default function QRForm({ onGenerateQR }) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!value.trim()) {
            setError('Please enter a value');
            return;
        }

        setError('');
        onGenerateQR(value);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="qr-value" className="block text-sm font-medium text-blue-700 mb-1">
                    Enter text or URL
                </label>
                <input
                    id="qr-value"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Generate QR Code
            </button>

            <div className="text-center text-sm text-gray-500">
                <p>Enter any text or URL to generate a QR code</p>
            </div>
        </form>
    );
}
