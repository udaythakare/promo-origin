import React from 'react';

const FormInput = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    error,
    className = '',
    ...props
}) => {
    const baseClasses = "w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base";

    return (
        <div className="space-y-2">
            <label className="block font-bold text-lg">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`${baseClasses} min-h-[100px] ${className}`}
                    placeholder={placeholder}
                    required={required}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`${baseClasses} ${className}`}
                    placeholder={placeholder}
                    required={required}
                    {...props}
                />
            )}
            {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>
    );
};

export default FormInput;