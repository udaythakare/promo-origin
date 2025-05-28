import React from 'react';

const CouponTypeSelector = ({ value, onChange }) => {
    const types = [
        { key: 'redeem_at_store', label: 'Redeem In-Store' },
        { key: 'redeem_online', label: 'Redeem Online' }
    ];

    return (
        <div className="space-y-2">
            <label className="block font-bold text-lg">Coupon Type</label>
            <div className="grid grid-cols-2 gap-3">
                {types.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onChange(key)}
                        className={`p-3 border-2 border-black font-bold ${value === key
                                ? 'bg-blue-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            } transition-all`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CouponTypeSelector;