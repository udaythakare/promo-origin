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
        <div className="bg-yellow-100 p-5 md:p-7 rounded-none border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl mx-auto">

            {/* General error message area */}
            {errors.general && (
                <div className="mb-5 p-3 bg-red-300 border-3 border-black text-black font-bold rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div>
                    <label htmlFor="full_name" className="block text-base font-bold text-black mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border-3 ${errors.full_name ? 'border-red-500 bg-red-100' : 'border-black'} rounded-none focus:outline-none focus:bg-cyan-100 transition-colors text-black font-medium text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                        required
                    />
                    {errors.full_name && (
                        <p className="mt-1 text-xs font-bold text-red-600 bg-red-100 p-1 border-2 border-red-500 inline-block">
                            {errors.full_name}
                        </p>
                    )}
                </div>

                {/* Username Field */}
                <div>
                    <label htmlFor="username" className="block text-base font-bold text-black mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border-3 ${errors.username ? 'border-red-500 bg-red-100' : 'border-black'} rounded-none focus:outline-none focus:bg-cyan-100 transition-colors text-black font-medium text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                        required
                    />
                    {errors.username && (
                        <p className="mt-1 text-xs font-bold text-red-600 bg-red-100 p-1 border-2 border-red-500 inline-block">
                            {errors.username}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-base font-bold text-black mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border-3 border-black rounded-none bg-gray-200 text-gray-600 font-medium text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        disabled
                        title="Email cannot be changed"
                    />
                    <p className="mt-1 text-xs font-bold text-black bg-gray-200 p-1 border-2 border-black inline-block rotate-1">
                        Email cannot be changed
                    </p>
                </div>

                {/* Mobile Number Field */}
                <div>
                    <label htmlFor="mobile_number" className="block text-base font-bold text-black mb-1">
                        Mobile Number
                    </label>
                    <input
                        type="tel"
                        id="mobile_number"
                        name="mobile_number"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border-3 ${errors.mobile_number ? 'border-red-500 bg-red-100' : 'border-black'} rounded-none focus:outline-none focus:bg-cyan-100 transition-colors text-black font-medium text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                        required
                    />
                    {errors.mobile_number && (
                        <p className="mt-1 text-xs font-bold text-red-600 bg-red-100 p-1 border-2 border-red-500 inline-block">
                            {errors.mobile_number}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-5 rounded-none text-black font-black text-lg 
                            ${isSubmitting ? 'bg-blue-300 border-black' : 'bg-green-400 hover:bg-green-500 hover:-translate-y-1'} 
                            border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                            transition-all duration-200 ease-in-out transform hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
                    >
                        {isSubmitting ? 'UPDATING...' : 'UPDATE INFO'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PersonalInfoForm