import React from 'react';
import { RefreshCw, MapPin, Globe } from 'lucide-react';

export const CouponHeader = ({ lastRefreshed, loading, onRefresh, locationSource, locationName }) => {
    const formatRefreshTime = (date) => {
        if (!date) return '';
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getLocationBadge = () => {
        if (locationSource === 'area') {
            return (
                <span className="flex items-center gap-1 bg-green-300 text-black text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                    <MapPin size={12} />
                    COUPONS IN {locationName?.toUpperCase()}
                </span>
            );
        }
        if (locationSource === 'city') {
            return (
                <span className="flex items-center gap-1 bg-blue-300 text-black text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                    <MapPin size={12} />
                    COUPONS IN {locationName?.toUpperCase()}
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 bg-yellow-300 text-black text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)]">
                <Globe size={12} />
                ALL COUPONS
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    {getLocationBadge()}
                    {lastRefreshed && (
                        <span className="text-sm text-gray-600">
                            Updated: {formatRefreshTime(lastRefreshed)}
                        </span>
                    )}
                </div>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 text-sm bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>
            {locationSource === 'all' && (
                <p className="text-sm text-gray-500 bg-gray-50 p-2 border border-gray-200 rounded">
                    No coupons found near your location — showing all available coupons.
                </p>
            )}
        </div>
    );
};