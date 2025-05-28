import React from 'react';

export const EmptyState = ({ onClearFilters }) => (
    <div className="text-center p-8">
        <div className="text-black text-2xl font-black p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rotate-1">
            NO COUPONS FOUND FOR THIS AREA
        </div>
        <button
            onClick={onClearFilters}
            className="mt-8 text-white bg-blue-500 px-6 py-3 font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-lg uppercase -rotate-1"
        >
            VIEW ALL COUPONS
        </button>
    </div>
);