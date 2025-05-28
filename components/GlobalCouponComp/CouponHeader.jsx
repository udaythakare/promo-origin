import React from 'react';
import { RefreshCw } from 'lucide-react';

export const CouponHeader = ({ lastRefreshed, loading, onRefresh }) => {
    const formatRefreshTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
                {lastRefreshed && (
                    <span>Last updated: {formatRefreshTime(lastRefreshed)}</span>
                )}
            </div>
            <button
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 text-sm bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh Coupons
            </button>
        </div>
    );
};