'use client'

import React, { useState } from 'react'

export default function LocationForm({ initialData = {}, onSubmit, dropDownData }) {
    console.log(initialData, 'initialData thisis ')
    const [formData, setFormData] = useState({
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        area: initialData.area || '',
        postal_code: initialData.postal_code || '',
    })

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const { areaData = [], cityData = [], stateData = [] } = dropDownData || {}

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            // Call the provided onSubmit function
            if (onSubmit) {
                await onSubmit(formData)

                setMessage('Location updated successfully!')
            }
        } catch (error) {
            setMessage('Failed to update location. Please try again.')
            console.error('Error updating location:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 my-4">
            <h2 className="text-xl font-medium text-blue-700 mb-4">Your Location</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your address"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select State</option>
                            {stateData?.map((state) => (
                                <option key={state.id} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select City</option>
                            {cityData?.map((city) => (
                                <option key={city.id} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                            Area
                        </label>
                        <select
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Area</option>
                            {areaData?.map((area) => (
                                <option key={area.id} value={area.name}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code
                        </label>
                        <input
                            type="text"
                            id="postal_code"
                            name="postal_code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Postal Code"
                            required
                        />
                    </div>
                </div>

                {message && (
                    <div className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update Location'}
                    </button>
                </div>
            </form>
        </div>
    )
}