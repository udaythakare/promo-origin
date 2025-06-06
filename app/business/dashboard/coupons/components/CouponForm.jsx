'use client';

import React from 'react';
import { useCouponForm } from '../../../../../hooks/useCouponForm';
import { format12HourTime } from '../../../../../utils/dateHelpers';
import WarningModal from '../../../../../components/WarningModal';
import BusinessSelector from '../../../../../components/BusinessSelectors';
import FormInput from '../../../../../components/FormInput';
import CouponTypeSelector from '../../../../../components/CouponTypeSelector';
import DateTimeSelector from '../../../../../components/DateTimeSelector';
import RedemptionDurationSelector from '../../../../../components/RedemptionDurationSelector';
import RedemptionTimeSelector from '../../../../../components/RedemptionTimeSelector';
import InfoPanel from '../../../../../components/InfoPanel';

export default function CouponForm({ coupon }) {
    const {
        formData,
        setFormData,
        businesses,
        isLoading,
        showWarning,
        setShowWarning,
        isSubmitting,
        errors,
        isEditing,
        handleSubmit,
        handleChange,
    } = useCouponForm(coupon);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="text-blue-600 font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black mb-6 border-b-4 border-black pb-2">
                {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>

            <WarningModal
                isVisible={showWarning}
                onCancel={() => setShowWarning(false)}
                onContinue={handleSubmit}
            />

            {isEditing && coupon && (
                <InfoPanel type="info" className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Original Coupon Times</h3>
                    <p><strong>Start:</strong> {new Date(coupon.start_date.replace(' ', 'T')).toLocaleString()} ({coupon.start_date})</p>
                    <p><strong>End:</strong> {new Date(coupon.end_date.replace(' ', 'T')).toLocaleString()} ({coupon.end_date})</p>
                    <p className="text-sm mt-2">
                        Times shown in 12-hour format:
                        Start: {format12HourTime(coupon.start_date)} |
                        End: {format12HourTime(coupon.end_date)}
                    </p>
                </InfoPanel>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* <BusinessSelector
                    businesses={businesses}
                    value={formData.business_id}
                    onChange={handleChange}
                    error={errors.business_id}
                /> */}

                <FormInput
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. 20% Off All Items"
                    required
                    error={errors.title}
                />

                <FormInput
                    label="Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the coupon details and any terms & conditions"
                    // required
                />

                <CouponTypeSelector
                    value={formData.coupon_type}
                    onChange={(type) => setFormData(prev => ({ ...prev, coupon_type: type }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DateTimeSelector
                        label="Start Date & Time"
                        value={formData.start_date}
                        onChange={(value) => setFormData(prev => ({ ...prev, start_date: value }))}
                        error={errors.start_date}
                        originalValue={coupon?.start_date}
                        isEditing={isEditing}
                    />

                    <DateTimeSelector
                        label="End Date & Time"
                        value={formData.end_date}
                        onChange={(value) => setFormData(prev => ({ ...prev, end_date: value }))}
                        error={errors.end_date}
                        originalValue={coupon?.end_date}
                        isEditing={isEditing}
                    />
                </div>

                <InfoPanel type="info">
                    <p className="font-medium">
                        <strong>📅 Note:</strong> Only future dates and times can be selected. If you select a past date or time, it will automatically update to the current date and time.
                    </p>
                </InfoPanel>

                {formData.coupon_type === 'redeem_at_store' && (
                    <>
                        <RedemptionDurationSelector
                            value={formData.redeem_duration}
                            onChange={(duration) => setFormData(prev => ({ ...prev, redeem_duration: duration }))}
                        />

                        <RedemptionTimeSelector
                            timeType={formData.redemption_time_type}
                            onTimeTypeChange={(type) => setFormData(prev => ({ ...prev, redemption_time_type: type }))}
                            startTime={formData.redemption_start_time}
                            endTime={formData.redemption_end_time}
                            onStartTimeChange={(time) => setFormData(prev => ({ ...prev, redemption_start_time: time }))}
                            onEndTimeChange={(time) => setFormData(prev => ({ ...prev, redemption_end_time: time }))}
                        />
                    </>
                )}

                <FormInput
                    label="Max Claims"
                    name="max_claims"
                    type="number"
                    value={formData.max_claims}
                    onChange={handleChange}
                    placeholder="Leave blank for unlimited"
                />
                <p className="text-sm text-gray-600 -mt-3">Leave blank for unlimited claims</p>

                {errors.form && (
                    <InfoPanel type="error">
                        {errors.form}
                    </InfoPanel>
                )}

                <InfoPanel type="warning">
                    <p className="font-medium">
                        <strong>⚠️ Important:</strong> Once this coupon is claimed by any user, you will NOT be able to edit or delete it.
                    </p>
                </InfoPanel>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-green-200 border-3 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : isEditing ? 'Update Coupon' : 'Create Coupon'}
                    </button>
                </div>
            </form>
        </div>
    );
}