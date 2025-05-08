// app/businesses/components/DeleteBusinessButton.tsx - Delete business button (Client Component)
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';



export default function DeleteBusinessButton({
    businessId,
    businessName,
    redirectAfterDelete = '/businesses',
    buttonStyle = 'text',
}) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/businesses/${businessId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete business');
            }

            toast.success('Business deleted successfully');
            router.push(redirectAfterDelete);
            router.refresh(); // Refresh server components
        } catch (error) {
            toast.error(error.message || 'An error occurred');
            console.error('Delete error:', error);
        } finally {
            setIsDeleting(false);
            setShowConfirmation(false);
        }
    };

    // If confirmation dialog is open
    if (showConfirmation) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete <strong>{businessName}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowConfirmation(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200 disabled:opacity-70"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Business'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Regular button
    if (buttonStyle === 'button') {
        return (
            <button
                onClick={() => setShowConfirmation(true)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
                type="button"
            >
                Delete Business
            </button>
        );
    }

    // Text link style
    return (
        <button
            onClick={() => setShowConfirmation(true)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            type="button"
        >
            Delete
        </button>
    );
}