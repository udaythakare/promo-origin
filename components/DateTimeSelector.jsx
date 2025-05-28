import React from 'react';
import { formatDateForInput, formatTimeForInput, combineDateTime, format12HourTime } from '../utils/dateHelpers';

const DateTimeSelector = ({
    label,
    value,
    onChange,
    error,
    originalValue,
    isEditing
}) => {
    const handleDateChange = (e) => {
        const newDateTime = combineDateTime(
            e.target.value,
            formatTimeForInput(value)
        );
        onChange(newDateTime);
    };

    const handleTimeChange = (e) => {
        const newDateTime = combineDateTime(
            formatDateForInput(value),
            e.target.value
        );
        onChange(newDateTime);
    };

    return (
        <div className="space-y-2">
            <label className="block font-bold text-lg">{label}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                    type="date"
                    value={formatDateForInput(value)}
                    onChange={handleDateChange}
                    className="p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                    required
                />
                <input
                    type="time"
                    value={formatTimeForInput(value)}
                    onChange={handleTimeChange}
                    className="p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                    required
                />
            </div>
            {error && <p className="text-red-500 font-medium">{error}</p>}

            {isEditing && originalValue && (
                <div className="text-xs text-gray-500">
                    Original value: {format12HourTime(originalValue)}
                </div>
            )}
        </div>
    );
};

export default DateTimeSelector;