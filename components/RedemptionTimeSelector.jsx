import React from 'react';

const RedemptionTimeSelector = ({
    timeType,
    onTimeTypeChange,
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange
}) => {
    return (
        <div className="space-y-2">
            <label className="block font-bold text-lg">Redemption Hours</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onTimeTypeChange('anytime')}
                    className={`p-3 border-2 border-black font-bold ${timeType === 'anytime'
                            ? 'bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        } transition-all`}
                >
                    Anytime
                </button>
                <button
                    type="button"
                    onClick={() => onTimeTypeChange('specific_hours')}
                    className={`p-3 border-2 border-black font-bold ${timeType === 'specific_hours'
                            ? 'bg-green-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        } transition-all`}
                >
                    Specific Hours
                </button>
            </div>

            {timeType === 'specific_hours' && (
                <div className="space-y-4 bg-gray-50 border-2 border-black p-4">
                    <h4 className="font-bold text-lg">Set Redemption Hours</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block font-bold text-base">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => onStartTimeChange(e.target.value)}
                                className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                                required={timeType === 'specific_hours'}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-bold text-base">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => onEndTimeChange(e.target.value)}
                                className="w-full p-3 bg-white border-2 border-black focus:outline-none focus:border-black focus:ring-0 text-base"
                                required={timeType === 'specific_hours'}
                            />
                        </div>
                    </div>
                    <div className="bg-blue-100 border-2 border-blue-500 p-3 text-sm">
                        <p className="font-medium">
                            📍 Redemption will be available from <strong>{startTime}</strong> to <strong>{endTime}</strong> daily
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedemptionTimeSelector;