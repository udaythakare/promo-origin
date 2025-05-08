'use client';

import { useState } from 'react';
import { updateBusinessInfo } from '@/actions/businessInfoAction'; // You'll need to create this action

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
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {isEditing ? (
            type === 'textarea' ? (
                <textarea
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )
        ) : (
            <div className="p-2 bg-gray-50 rounded-md border border-gray-200">{value || 'Not provided'}</div>
        )}
    </div>
);

// Section component for grouping related fields
const Section = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">{title}</h3>
        <div className="pl-2">{children}</div>
    </div>
);

// Main component that receives the business info data
export default function BusinessInfoForm({ businessInfo }) {
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
        setIsSubmitting(true);
        try {
            // Call the server action to update the business info
            const result = await updateBusinessInfo(formData);

            if (result.success) {
                setMessage({ type: 'success', text: 'Business information updated successfully!' });
                setIsEditing(false);
            } else {
                setMessage({ type: 'error', text: result.message || 'Error updating business information' });
            }
        } catch (error) {
            console.error('Error updating business info:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Business Information</h2>
                <button
                    onClick={() => {
                        if (isEditing) {
                            setFormData(businessInfo); // Reset form data on cancel
                            setMessage({ type: '', text: '' });
                        }
                        setIsEditing(!isEditing);
                    }}
                    className={`px-4 py-2 rounded-md transition-colors ${isEditing
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    disabled={isSubmitting}
                >
                    {isEditing ? 'Cancel' : 'Edit Info'}
                </button>
            </div>

            {/* Status message */}
            {message.text && (
                <div
                    className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {/* Basic Information Section */}
                    <Section title="Basic Information">
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
                        {/* <InfoField
                            label="Category ID"
                            value={formData.category_id}
                            isEditing={isEditing}
                            name="category_id"
                            onChange={handleChange}
                        /> */}
                    </Section>

                    {/* Contact Information Section */}
                    <Section title="Contact Information">
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
                    <Section title="Location Information">
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

                    {/* System Information Section (Read-only) */}
                    <Section title="System Information">
                        {/* <InfoField
                            label="Business ID"
                            value={formData.business_id}
                            isEditing={false}
                            name="business_id"
                            onChange={handleChange}
                        /> */}
                        <InfoField
                            label="Created Date"
                            value={new Date(formData.created_at).toLocaleDateString()}
                            isEditing={false}
                            name="created_at"
                            onChange={handleChange}
                        />
                        <InfoField
                            label="Is Primary Location"
                            value={formData.is_primary ? 'Yes' : 'No'}
                            isEditing={false}
                            name="is_primary"
                            onChange={handleChange}
                        />
                    </Section>
                </div>

                {/* Submit button - only show when editing */}
                {isEditing && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}