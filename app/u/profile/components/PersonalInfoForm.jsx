'use client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

const PersonalInfoForm = ({ initialData, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        username: initialData?.username || '',
        full_name: initialData?.full_name || '',
        email: initialData?.email || '',
        mobile_number: initialData?.mobile_number || '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear field-specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Check required fields
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        }

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required'
        }

        if (!formData.mobile_number.trim()) {
            newErrors.mobile_number = 'Mobile number is required'
        } else if (!/^\d{10}$/.test(formData.mobile_number)) {
            newErrors.mobile_number = 'Mobile number must be exactly 10 digits'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fix the errors in the form')
            return
        }

        setIsSubmitting(true)

        try {
            const result = await onSubmit(formData)

            if (result.success) {
                toast.success('Personal information updated successfully')
            } else {
                // Handle specific field errors from backend
                if (result.fieldErrors) {
                    setErrors(result.fieldErrors)
                    toast.error('Please fix the errors in the form')
                } else {
                    toast.error(result.error || 'Failed to update information')
                }
            }
        } catch (error) {
            toast.error('An error occurred while updating information')
            console.error('Form submission error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Personal Information</h2>

            {/* General error message area */}
            {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-md">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {/* Full Name Field */}
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {errors.full_name && (
                            <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>
                        )}
                    </div>

                    {/* Username Field */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                            disabled
                            title="Email cannot be changed"
                        />
                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    {/* Mobile Number Field */}
                    <div>
                        <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            id="mobile_number"
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border ${errors.mobile_number ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {errors.mobile_number && (
                            <p className="mt-1 text-xs text-red-500">{errors.mobile_number}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium 
                ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} 
                transition duration-200 ease-in-out`}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Information'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PersonalInfoForm