'use client';

import { updateBusinessInfo } from '@/actions/businessInfoAction';
import { useState } from 'react';

// Component to display individual fields
const InfoField = ({
    label,
    value,
    isEditing,
    name,
    onChange,
    type = 'text',
    required = false
}) => (
    <div className="mb-6">
        <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase tracking-wider">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
            type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                    className="w-full p-3 sm:p-4 border-4 border-black bg-white text-black font-bold placeholder:text-gray-500 focus:outline-none focus:bg-yellow-200 focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    rows={4}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                    className="w-full p-3 sm:p-4 border-4 border-black bg-white text-black font-bold placeholder:text-gray-500 focus:outline-none focus:bg-yellow-200 focus:border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            )
        ) : (
            <div className="p-3 sm:p-4 bg-gray-100 border-4 border-black font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {value || 'Not provided'}
            </div>
        )}
    </div>
);

// Section component for grouping related fields
const Section = ({ title, children }) => (
    <div className="mb-8 sm:mb-12">
        <div className="bg-blue-400 border-4 border-black p-3 sm:p-4 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg sm:text-xl font-black text-black uppercase tracking-wider">
                {title}
            </h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// Main component that receives the business info data
export default function BusinessInfoForm({ businessInfo = {} }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(businessInfo);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData, 'this is formdata')
        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const res = await updateBusinessInfo(formData)
            console.log(res, 'this is data')


            setMessage({ type: 'success', text: 'BUSINESS INFO UPDATED SUCCESSFULLY!' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating business info:', error);
            setMessage({ type: 'error', text: 'ERROR UPDATING BUSINESS INFORMATION!' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // <div className="min-h-screen bg-pink-200 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-yellow-300 border-4 border-black p-4 sm:p-6 mb-6 sm:mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black uppercase tracking-wider">
                        Business Info
                    </h1>
                    <button
                        onClick={() => {
                            if (isEditing) {
                                setFormData(businessInfo);
                                setMessage({ type: '', text: '' });
                            }
                            setIsEditing(!isEditing);
                        }}
                        className={`px-4 sm:px-6 py-3 sm:py-4 border-4 border-black font-black uppercase tracking-wider text-sm sm:text-base transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${isEditing
                            ? 'bg-red-400 hover:bg-red-500 text-black'
                            : 'bg-green-400 hover:bg-green-500 text-black'
                            }`}
                        disabled={isSubmitting}
                    >
                        {isEditing ? 'Cancel' : 'Edit Info'}
                    </button>
                </div>
            </div>

            {/* Status message */}
            {message.text && (
                <div className={`mb-6 sm:mb-8 p-4 sm:p-6 border-4 border-black font-black text-black uppercase tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${message.type === 'success'
                    ? 'bg-green-300'
                    : 'bg-red-300'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Main Form Container */}
            <div className="bg-white border-4 border-black p-4 sm:p-6 lg:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Basic Information Section */}
                        <Section title="Basic Info">
                            <InfoField
                                label="Business Name"
                                value={formData.name}
                                isEditing={isEditing}
                                name="name"
                                onChange={handleChange}
                                required
                            />
                            <InfoField
                                label="Description"
                                value={formData.description}
                                isEditing={isEditing}
                                name="description"
                                onChange={handleChange}
                                type="textarea"
                            />
                        </Section>

                        {/* Contact Information Section */}
                        <Section title="Contact Info">
                            <InfoField
                                label="Email"
                                value={formData.email}
                                isEditing={isEditing}
                                name="email"
                                onChange={handleChange}
                                type="email"
                                required
                            />
                            <InfoField
                                label="Phone"
                                value={formData.phone}
                                isEditing={isEditing}
                                name="phone"
                                onChange={handleChange}
                                type="tel"
                            />
                            <InfoField
                                label="Website"
                                value={formData.website}
                                isEditing={isEditing}
                                name="website"
                                onChange={handleChange}
                                type="url"
                            />
                        </Section>

                        {/* Location Information Section */}
                        <Section title="Location Info">
                            <InfoField
                                label="Address"
                                value={formData.address}
                                isEditing={isEditing}
                                name="address"
                                onChange={handleChange}
                            />
                            <InfoField
                                label="Area"
                                value={formData.area}
                                isEditing={isEditing}
                                name="area"
                                onChange={handleChange}
                            />
                            <InfoField
                                label="City"
                                value={formData.city}
                                isEditing={isEditing}
                                name="city"
                                onChange={handleChange}
                            />
                            <InfoField
                                label="State"
                                value={formData.state}
                                isEditing={isEditing}
                                name="state"
                                onChange={handleChange}
                            />
                            <InfoField
                                label="Postal Code"
                                value={formData.postal_code}
                                isEditing={isEditing}
                                name="postal_code"
                                onChange={handleChange}
                            />
                            <InfoField
                                label="Country"
                                value={formData.country}
                                isEditing={isEditing}
                                name="country"
                                onChange={handleChange}
                            />
                        </Section>


                    </div>

                    {/* Submit button - only show when editing */}
                    {isEditing && (
                        <div className="mt-8 sm:mt-12 flex justify-center">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-blue-400 hover:bg-blue-500 border-4 border-black text-black font-black uppercase tracking-wider text-lg sm:text-xl transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
        // </div>
    );
}