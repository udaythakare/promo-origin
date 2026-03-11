'use client';

import { FiTrendingUp } from 'react-icons/fi';

const StatCard = ({ icon, title, value, trend, color }) => {

    const hasTrend = typeof trend === "number";

    return (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 flex flex-col">
            
            <div className="flex justify-between items-center mb-4">
                
                <div className={`p-3 ${color}`}>
                    {icon}
                </div>

                {hasTrend && (
                    <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <FiTrendingUp className={trend < 0 ? 'rotate-180' : ''} />
                        <span className="ml-1 text-sm font-bold">
                            {Math.abs(trend)}%
                        </span>
                    </div>
                )}

            </div>

            <h3 className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-wide">
                {title ?? "—"}
            </h3>

            <p className="text-xl md:text-2xl font-black text-gray-800 mt-1">
                {value ?? 0}
            </p>

        </div>
    );
};

export default StatCard;