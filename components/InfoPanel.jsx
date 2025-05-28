import React from 'react';

const InfoPanel = ({ type, children, className = '' }) => {
    const baseClasses = "border-2 p-3";
    const typeClasses = {
        warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
        info: "bg-blue-100 border-blue-500 text-blue-800",
        error: "bg-red-100 border-red-500 text-red-700"
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
            {children}
        </div>
    );
};

export default InfoPanel;