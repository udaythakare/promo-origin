'use client';

import React, { useEffect, useState } from 'react';
import { getAllCouponRedemptionRequests, updateCouponRequestStatus } from './actions/redemptionAction';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const CouponRedemptionRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [rejectionReason, setRejectionReason] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const result = await getAllCouponRedemptionRequests();
                if (result.error) {
                    setError(result.error);
                } else {
                    setRequests(result.data || []);
                }
            } catch (err) {
                setError('Failed to fetch redemption requests');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleStatusChange = async (requestId, newStatus) => {
        if (newStatus === 'rejected') {
            // Open modal for rejection reason
            setSelectedRequestId(requestId);
            setIsModalOpen(true);
        } else {
            try {
                const result = await updateCouponRequestStatus(requestId, newStatus);
                if (result.error) {
                    setError(result.error);
                } else {
                    // Update local state to reflect the change
                    setRequests(prevRequests =>
                        prevRequests.map(req =>
                            req.id === requestId ? { ...req, status: newStatus } : req
                        )
                    );
                    router.refresh(); // Refresh the page to update data
                }
            } catch (err) {
                setError('Failed to update status');
                console.error(err);
            }
        }
    };

    const handleRejectConfirm = async () => {
        try {
            const result = await updateCouponRequestStatus(
                selectedRequestId,
                'rejected',
                rejectionReason
            );
            if (result.error) {
                setError(result.error);
            } else {
                // Update local state to reflect the change
                setRequests(prevRequests =>
                    prevRequests.map(req =>
                        req.id === selectedRequestId
                            ? { ...req, status: 'rejected', rejection_reason: rejectionReason }
                            : req
                    )
                );
                closeModal();
                router.refresh(); // Refresh the page to update data
            }
        } catch (err) {
            setError('Failed to reject request');
            console.error(err);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequestId(null);
        setRejectionReason('');
    };

    const filteredRequests = statusFilter === 'all'
        ? requests
        : requests.filter(req => req.status === statusFilter);

    const statusColorMap = {
        pending: 'bg-yellow-100 text-yellow-800',
        verified: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '-';
        return format(new Date(dateTimeStr), 'MMM d, yyyy h:mm a');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Coupon Redemption Requests</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded ${statusFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-4 py-2 rounded ${statusFilter === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setStatusFilter('verified')}
                    className={`px-4 py-2 rounded ${statusFilter === 'verified'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Verified
                </button>
                <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-4 py-2 rounded ${statusFilter === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Completed
                </button>
                <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`px-4 py-2 rounded ${statusFilter === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                        }`}
                >
                    Rejected
                </button>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coupon
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Business
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Request Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No redemption requests found with the selected filter.
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {request.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>
                                            <p className="font-medium">{request.users.username}</p>
                                            <p className="text-xs">{request.users.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>
                                            <p className="font-medium">{request.coupons.title}</p>
                                            <p className="text-xs">Code: {request.coupons.code}</p>
                                            <p className="text-xs">
                                                {request.coupons.discount_type === 'percentage'
                                                    ? `${request.coupons.discount_value}% off`
                                                    : request.coupons.discount_type === 'fixed_amount'
                                                        ? `$${request.coupons.discount_value} off`
                                                        : request.coupons.discount_type}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>
                                            <p className="font-medium">{request.business_locations.businesses.name}</p>
                                            <p className="text-xs">
                                                {request.business_locations.city}, {request.business_locations.state}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateTime(request.request_timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[request.status]
                                                }`}
                                        >
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
                                        {request.status === 'rejected' && request.rejection_reason && (
                                            <p className="text-xs text-red-500 mt-1">
                                                Reason: {request.rejection_reason}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col space-y-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(request.id, 'verified')}
                                                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded"
                                                    >
                                                        Verify
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(request.id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {request.status === 'verified' && (
                                                <button
                                                    onClick={() => handleStatusChange(request.id, 'completed')}
                                                    className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-2 py-1 rounded"
                                                >
                                                    Complete
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    // View details functionality can be added here
                                                    alert(`Verification Code: ${request.verification_code}`);
                                                }}
                                                className="text-gray-600 hover:text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded"
                                            >
                                                View Code
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Rejection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Redemption Request</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                placeholder="Enter reason for rejection"
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponRedemptionRequestsPage;