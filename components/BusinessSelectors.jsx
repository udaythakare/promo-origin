import React from 'react';

const BusinessSelector = ({ businesses, value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label className="block font-bold text-lg">Business</label>
            <select
                name="business_id"
                value={value}
                onChange={onChange}
                className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                required
            >
                <option value="">Select a business</option>
                {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                        {business.name}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>
    );
};

export default BusinessSelector;